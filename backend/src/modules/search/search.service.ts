import { singleton, inject } from "tsyringe";
import type { SearchRequest, SearchResponseData, LegResponse} from "./search.types.js";
import { Itinerary } from "./models/itinerary.model.js";
import { SerpApiClient } from "@/services/serpapi/serpapi.client.js";
import { Search } from "./models/search.model.js";
import "./models/itinerary.model.js"; // Necesario para .populate("itineraries")
import { SearchNotFoundError } from "./search.errors.js";
import { SerpapiStorageService } from "../serpapi-storage/serpapi-storage.service.js";
import { Dijkstra } from "@/algorithms/dijkstra.js";
import type { DijkstraFlightEdge } from "../serpapi-storage/dijkstra.types.js";
import type { ApiRequestParameters, SerpApiResponse, FlightRoute } from "@/services/serpapi/serpapi.types.js";
import { getCandidateLayovers } from "./candidate-layovers.js";

@singleton()
export class SearchService {
    constructor(
        @inject(SerpapiStorageService) private readonly storageService: SerpapiStorageService, 
        @inject(SerpApiClient) private readonly serpApiClient: SerpApiClient,
        @inject(Dijkstra) private readonly dijkstra: Dijkstra
    ) {}
    public async createSearch(data: SearchRequest & { user_id?: string }): Promise<SearchResponseData> {
        const search = await Search.create(data);
        this.runExploration(search.public_id, data);
        return this.formatSearchResponse(search.toJSON());
    }

    public async getSearch(searchId: string, requesterId: string | undefined): Promise<SearchResponseData> {
        const query = requesterId
            ? { public_id: searchId, $or: [{ user_id: requesterId }, { user_id: { $exists: false } }] }
            : { public_id: searchId, user_id: { $exists: false } };

        const search = await Search.findOne(query).populate("itineraries");
        if (search == null)
            throw new SearchNotFoundError(searchId, requesterId ?? 'anonymous');

        return this.formatSearchResponse(search.toJSON());
    }

    private async runExploration(searchId: string, criteria: SearchRequest) {
    try {
        const sequence = [criteria.origins[0], ...criteria.destinations].filter((node): node is string => !!node);        
        let currentDate = criteria.departure_date;
        const fullPath: DijkstraFlightEdge[] = [];

        for (let i = 0; i < sequence.length - 1; i++) {
            const puntoA = sequence[i];
            const puntoB = sequence[i + 1];

            if (!puntoA || !puntoB) continue;

            const candidatos = await getCandidateLayovers(puntoA, puntoB);
            const edges = (await this.getFlights(candidatos, currentDate))
                .filter(edge => isValidNextFlight(edge.date, currentDate));

            const tramo = this.dijkstra.findPath(puntoA, puntoB, edges, criteria.criteria.priority);

            if (!tramo) {
                    console.warn(`Tramo inalcanzable: ${puntoA} -> ${puntoB}`);
                await Search.updateOne({ public_id: searchId }, { status: "failed" });
                return;
            }
            const lastFlight = tramo[tramo.length - 1];
            currentDate = lastFlight!.date;


            fullPath.push(...tramo);
        }


        if (fullPath.length > 0) {
            const totalPrice = fullPath.reduce((sum, edge) => sum + edge.price, 0);
            const totalDuration = fullPath.reduce((sum, edge) => sum + edge.duration, 0);

            const legs: LegResponse[] = fullPath.map((edge, index) => ({
                order: index + 1,
                flight_id: edge.id,
                origin: edge.from,
                destination: edge.to,
                price: edge.price,
                duration: edge.duration
            }));

            await Itinerary.create({
                search_id: searchId,
                total_price: totalPrice,
                total_duration: totalDuration,
                legs: legs,
                city_order: sequence,
                score: 10,
                created_at: new Date()
            });

            await Search.updateOne(
                { public_id: searchId },
                { status: "completed" }
            );
            
            console.log(`Exploración finalizada para ${searchId}: ${fullPath.length} vuelos encontrados.`);
        } else {
            await Search.updateOne({ public_id: searchId }, { status: "failed" });
        }

    } catch (error) {
        console.error(`Error en exploración ${searchId}:`, error);
        await Search.updateOne({ public_id: searchId }, { status: "failed" });
    }
}

    private formatSearchResponse(data: any): SearchResponseData {
        return {
            ...data,
            created_at: data.created_at instanceof Date ? data.created_at.toISOString() : data.created_at,
            itineraries: data.itineraries?.map((itinerary: any) => ({
                ...itinerary,
                created_at: itinerary.created_at instanceof Date ? itinerary.created_at.toISOString() : itinerary.created_at
            }))
        };
    }

    private async getFlights(nodos: string[], date: string) : Promise<DijkstraFlightEdge[]> {
        const edges: DijkstraFlightEdge[] = [];
        for (let i = 0; i < nodos.length; i++) {
            for (let j = 0; j < nodos.length; j++) {
                if (i === j) continue;

                const origin = nodos[i];
                const destination = nodos[j];

                if (!origin || !destination) continue;

                const existingFlights = await this.storageService.getFlightsForGraph(origin, destination, date);

                if (existingFlights.length === 0) {
                               
                    const newFlights = await this.getFlightsFromSerpApi(origin, destination, date);
                    edges.push(...newFlights);
                } else {
                    edges.push(...existingFlights);
                }
        }
        }
        return edges;
    }

    private async getFlightsFromSerpApi(origin: string, destination: string, date: string) : Promise<DijkstraFlightEdge[]> {

        const response = await this.serpApiClient.search(this.createApiParams(origin, destination, date));

        return this.mapResponseToEdges(response);
    }

    private createApiParams(origin: string, destination: string, date: string) : ApiRequestParameters{

        const params: ApiRequestParameters = {
            departure_id : origin,
            arrival_id : destination,
            outbound_date : date,
            gl : "es",
            hl : "es",
            currency : "EUR",
            type : 2

        }
        return params;
    }

    private mapResponseToEdges(response: SerpApiResponse): DijkstraFlightEdge[] {
    const allFlights: FlightRoute[] = [
        ...(response.best_flights || []),
        ...(response.other_flights || [])
    ];
    return allFlights.map((flight): DijkstraFlightEdge => {
        const firstSegment = flight.flights[0];
        const lastSegment = flight.flights[flight.flights.length - 1];

        return {
            id: flight.booking_token,
            from: firstSegment!.departure_airport.id,
            to: lastSegment!.arrival_airport.id,
            price: flight.price,
            duration: flight.total_duration,
            stops: flight.layovers ? flight.layovers.length : 0,
            date: response.search_parameters.outbound_date
        };
    });
}
}



function isValidNextFlight(flightDate: string, currentDate: string): boolean {
    const f = new Date(flightDate);
    const c = new Date(currentDate);

    c.setDate(c.getDate() + 1); // mínimo +1 día

    return f >= c;
}

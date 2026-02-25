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
import { getOriginalNode } from "typescript";

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
        const layoverDays = criteria.layover_days ?? [];
        const fullPath: DijkstraFlightEdge[] = [];

        for (let i = 0; i < sequence.length - 1; i++) {
            const puntoA = sequence[i];
            const puntoB = sequence[i + 1];
            const edges : DijkstraFlightEdge[] = [];

            if (!puntoA || !puntoB) continue;

            const stayDays = layoverDays[i] ?? 1;
            const searchDate = i === 0 ? currentDate : addDays(currentDate, stayDays);

            const candidatos = await getCandidateLayovers(puntoA, puntoB);
            let originArray = [puntoA];
            let destinationArray = candidatos.length > 0 ? candidatos : [puntoB];
            const originToLayoversEdges = (await this.getFlightsFromSerpApi(originArray, destinationArray, searchDate)).filter(edge => isValidNextFlight(edge.date, searchDate));

            edges.push(...originToLayoversEdges);

            originArray = candidatos.length > 0 ? candidatos : [puntoA];
            destinationArray = [puntoB];
            const layoversToDestEdges = (await this.getFlightsFromSerpApi(originArray, destinationArray, searchDate)).filter(edge => isValidNextFlight(edge.date, searchDate));

            edges.push(...layoversToDestEdges);

            const directFligtEdges = (await this.getFlightsFromSerpApi([puntoA], [puntoB], searchDate)).filter(edge => isValidNextFlight(edge.date, searchDate));

            edges.push(...directFligtEdges);

            const tramo = this.dijkstra.findPath(puntoA, puntoB, edges, criteria.criteria.priority);

            if (!tramo) {
                    console.warn(`Tramo inalcanzable: ${puntoA} -> ${puntoB}`);
                await Search.updateOne({ public_id: searchId }, { status: "failed" });
                return;
            }
            currentDate = tramo[tramo.length - 1]!.date;


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

    private async getFlightsFromSerpApi(origin: string[], destination: string[], date: string) : Promise<DijkstraFlightEdge[]> {

        const response = await this.serpApiClient.search(this.createApiParams(origin, destination, date));

        const edges = this.mapResponseToEdges(response);

        if(origin.length === 1 && destination.length === 1) {
            return edges;
        }

        if(origin.length === 1) {
            return edges.filter(edge=>edge.from === origin[0] && destination.includes(edge.to));
        }

        if(destination.length === 1) {
            return edges.filter(edge=>edge.to === destination[0] && origin.includes(edge.from));
        }

        return [];

    }

    private createApiParams(origins: string[], destinations: string[], date: string) : ApiRequestParameters{

        const params: ApiRequestParameters = {
            departure_id : origins,
            arrival_id : destinations,
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



function isValidNextFlight(flightDate: string, minDate: string): boolean {
    return new Date(flightDate) >= new Date(minDate);
}

function addDays(date: string, days: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0]!;
}

import type { FlightRoute } from "@/services/serpapi/serpapi.types.js";
import { singleton } from "tsyringe";
import { SerpapiStorage } from "./serpapi-storage.model.js";
import type { DijkstraFlightEdge } from "./dijkstra.types.js";

@singleton()
export class SerpapiStorageService {
    private readonly CACHE_TTL_HOURS = 24;

    public async getAllFlights(departure: string, arrival: string, date: string): Promise<FlightRoute[]> {
        
        // Set freshness limit (24 hours ago)
        const freshnessLimit = new Date();
        freshnessLimit.setHours(freshnessLimit.getHours() - this.CACHE_TTL_HOURS);

        const record = await SerpapiStorage.findOne({
            "search_parameters.departure_id": departure,
            "search_parameters.arrival_id": arrival,
            "search_parameters.outbound_date": date,
            createdAt: { $gte: freshnessLimit }
        }).sort({ createdAt: -1 }).lean();

        if (!record) {
            return [];
        }

        // Concatenate best flights and other flights
        const allFlights: FlightRoute[] = [
            ...(record.best_flights || []), 
            ...(record.other_flights || [])
        ];

        return allFlights;
    }

    public async getFlightsForGraph(departure: string, arrival: string, date: string): Promise<DijkstraFlightEdge[]> {
        const rawFlights = await this.getAllFlights(departure, arrival, date);

        const validEdges: DijkstraFlightEdge[] = [];

        for (const flight of rawFlights) {
            if (!flight.flights || flight.flights.length === 0) {
                continue;
            }

            const firstSegment = flight.flights[0];
            const lastSegment = flight.flights[flight.flights.length - 1];

            if (!firstSegment || !lastSegment) continue;

            validEdges.push({
                id: flight.booking_token,
                from: firstSegment.departure_airport.id,
                to: lastSegment.arrival_airport.id,
                price: flight.price,
                duration: flight.total_duration,
                stops: flight.layovers ? flight.layovers.length : 0
            });
        }
        
        return validEdges;
    }
}
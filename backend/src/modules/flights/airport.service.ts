import { singleton } from "tsyringe";
import { Airport } from "./models/airport.model.js";
import type { AirportResponse } from "./airport.types.js";

@singleton()
export class AirportService {
    public async searchAirports(query: string): Promise<AirportResponse[]> {
        if (!query || query.length < 2) return [];

        const regex = new RegExp(query, 'i');

        const airports = await Airport.find({
            $or: [
                { iata_code: regex },
                { city: regex },
                { name: regex }
            ]
        }).limit(10).lean();

        return airports;
    }
}

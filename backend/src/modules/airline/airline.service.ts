import { singleton } from "tsyringe";
import { Airline } from "./models/airline.model.js";
import type { IAirline } from "./models/airline.model.js";

@singleton()
export class AirlineService {
    public async searchAirlines(query: string): Promise<IAirline[]> {
        if (!query || query.length < 2) return [];

        const regex = new RegExp(query, 'i');

        const airlines = await Airline.find({
            $or: [
                { name: regex },
                { iata_code: regex },
                { icao_code: regex }
            ]
        }).limit(10).lean();

        return airlines;
    }
}
import type { FlightRoute } from "@/services/serpapi/serpapi.types.js";
import { singleton } from "tsyringe";

@singleton()
export class SerpapiStorageService {
    public async getAllFlights(departure: string, arrival: string, date: string): Promise<FlightRoute[]> {
        throw new Error("Not implemented"); // TODO
    }
}
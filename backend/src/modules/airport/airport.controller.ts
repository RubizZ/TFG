import { Controller, Get, Route, Query, Tags } from "tsoa";
import { injectable, inject } from "tsyringe";
import { AirportService } from "./airport.service.js";
import type { AirportResponse } from "./airport.types.js";

@injectable()
@Route("airports")
@Tags("Airports")
export class AirportController extends Controller {

    constructor(@inject(AirportService) private airportService: AirportService) {
        super();
    }

    @Get("/")
    public async search(@Query() q: string): Promise<AirportResponse[]> {
        const results = await this.airportService.searchAirports(q);
        return results;
    }
}
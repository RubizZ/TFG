import { Controller, Get, Route, Query, Tags } from "tsoa"
import { injectable, inject } from "tsyringe";
import { AirlineService } from "./airline.service.js";
import type { IAirline } from "./models/airline.model.js";

@injectable()
@Route("airlines")
@Tags("Airlines")
export class AirlineController extends Controller {
    constructor(@inject(AirlineService) private airlineService: AirlineService) {
        super();
    }

    @Get("/")
    public async search(@Query() q: string): Promise<IAirline[]> {
        return this.airlineService.searchAirlines(q);
    }
}
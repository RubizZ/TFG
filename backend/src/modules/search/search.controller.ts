import { Body, Controller, Get, Post, Query, RequestProp, Response, Route, Security, SuccessResponse as SuccessResponseDecorator, Tags } from "tsoa";
import type { SearchRequest, SearchResponseData, SearchValidationFailResponse } from "./search.types.js";
import { inject, injectable } from "tsyringe";
import { SearchService } from "./search.service.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import type { FailResponse, SuccessResponse } from "../../utils/responses.js";

@injectable()
@Route("search")
@Tags("Search")
export class SearchController extends Controller {

    constructor(
        @inject(SearchService) private readonly searchService: SearchService
    ) {
        super();
    }

    /**
     * Crea una nueva búsqueda de vuelos.
     * Si el usuario está autenticado, la búsqueda se asocia a su cuenta.
     */
    @Post("/")
    @Security('jwt-optional')
    @Response<SearchValidationFailResponse>(422, "Error de validación en la búsqueda")
    @SuccessResponseDecorator(201, "Búsqueda creada")
    public async searchRequest(
        @Body() body: SearchRequest,
        @RequestProp('user') user: AuthenticatedUser | null
    ): Promise<SuccessResponse<SearchResponseData>> {
        const request: SearchRequest & { user_id?: string } = { ...body };
        if (user) request.user_id = user.id;
        this.setStatus(201);
        const result = await this.searchService.createSearch(request);
        return result satisfies SearchResponseData as any;
    }

    /**
     * Obtiene los resultados de una búsqueda por su ID.
     * Solo devuelve búsquedas del usuario autenticado o búsquedas anónimas.
     */
    @Get("/")
    @Security('jwt-optional')
    @Response<FailResponse<'NOT_FOUND'>>(404, "Búsqueda no encontrada o no autorizada")
    public async searchResult(
        @Query('id') searchId: string,
        @RequestProp('user') user: AuthenticatedUser | null
    ): Promise<SuccessResponse<SearchResponseData>> {
        const result = await this.searchService.getSearch(searchId, user?.id);
        return result satisfies SearchResponseData as any;
    }
}
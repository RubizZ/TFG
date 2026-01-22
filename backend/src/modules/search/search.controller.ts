import { Body, Controller, Get, Header, Post, Query, RequestProp, Route, Security } from "tsoa";
import type { SearchRequest } from "./search.types.js";
import { inject, injectable } from "tsyringe";
import { SearchService } from "./search.service.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";

@injectable()
@Route("search")
export class SearchController extends Controller {

    constructor(
        @inject(SearchService) private readonly searchService: SearchService
    ) {
        super();
    }

    @Post("/")
    @Security('bearerAuth')
    @Security('bypass')
    public async searchRequest(
        @Body() body: SearchRequest,
        @RequestProp('user') user: AuthenticatedUser | null
    ) {
        return this.searchService.createSearch({ ...body, requesterId: user?.userId })
    }

    @Get("/")
    @Security('bearerAuth')
    @Security('bypass')
    public async searchResult(
        @Query('id') searchId: string,
        @RequestProp('user') user: AuthenticatedUser | null
    ) {
        return this.searchService.getSearch(searchId, user?.userId)
    }
}
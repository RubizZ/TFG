import { singleton } from "tsyringe";
import type { SearchRequest, SearchResponseData } from "./search.types.js";
import { Search, type ISearch } from "./models/search.model.js";
import "./models/itinerary.model.js"; // Necesario para .populate("itineraries")
import { SearchNotFoundError, SearchNotAuthorizedError } from "./search.errors.js";

@singleton()
export class SearchService {
    public async createSearch(data: SearchRequest & { user_id?: string }): Promise<SearchResponseData> {
        const createdData: Partial<ISearch> = { ...data };
        createdData.shared = !data.user_id;
        const search = await Search.create(createdData);
        this.runExploration(search.id, data);
        return this.formatSearchResponse(search.toJSON());
    }

    public async getSearch(searchId: string, requesterId: string | undefined): Promise<SearchResponseData> {
        const search = await Search.findOne({ id: searchId });

        if (search == null) {
            throw new SearchNotFoundError(searchId, requesterId ?? 'anonymous');
        }

        if (!search.shared && search.user_id !== requesterId) {
            throw new SearchNotAuthorizedError(searchId, requesterId ?? 'anonymous');
        }

        await search.populate("departure_itineraries");
        await search.populate("return_itineraries");

        return this.formatSearchResponse(search.toJSON());
    }

    public async shareSearch(searchId: string, requesterId: string): Promise<SearchResponseData> {
        const search = await Search.findOne({ id: searchId });

        if (search == null) {
            throw new SearchNotFoundError(searchId, requesterId);
        }

        if (search.user_id !== requesterId) {
            throw new SearchNotAuthorizedError(searchId, requesterId);
        }

        search.shared = true;
        await search.save();
        return this.formatSearchResponse(search.toJSON());
    }

    public async privatizeSearch(searchId: string, requesterId: string): Promise<SearchResponseData> {
        const search = await Search.findOne({ id: searchId });

        if (search == null) {
            throw new SearchNotFoundError(searchId, requesterId);
        }

        if (search.user_id !== requesterId) {
            throw new SearchNotAuthorizedError(searchId, requesterId);
        }

        search.shared = false;
        await search.save();
        return this.formatSearchResponse(search.toJSON());
    }

    private async runExploration(searchId: string, criteria: SearchRequest) {
        // TODO Implementar
        // Obtiene vertices (aeropuertos) que se van a explorar
        // Chequea aristas entre los vertices (vuelos) que se conocen, y obtiene de SerpApi las necesarias
        // Ejecuta A*
        // Guarda resultados finales en Itinerary, actualiza status de Search a completed
    }

    private formatSearchResponse(data: any): SearchResponseData {
        return {
            ...data,
            created_at: data.created_at instanceof Date ? data.created_at.toISOString() : data.created_at,
            departure_itineraries: data.departure_itineraries?.map((itinerary: any) => ({
                ...itinerary,
                created_at: itinerary.created_at instanceof Date ? itinerary.created_at.toISOString() : itinerary.created_at
            })),
            return_itineraries: data.return_itineraries?.map((itinerary: any) => ({
                ...itinerary,
                created_at: itinerary.created_at instanceof Date ? itinerary.created_at.toISOString() : itinerary.created_at
            }))
        };
    }
}
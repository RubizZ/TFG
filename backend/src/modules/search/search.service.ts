import { singleton } from "tsyringe";
import type { SearchRequest } from "./search.types.js";
import { Search } from "./models/search.model.js";
import { Itinerary } from "./models/itinerary.model.js"; // Necesario para .populate("itineraries")
import { SearchNotFoundError } from "./search.errors.js";

@singleton()
export class SearchService {
    public async createSearch(data: SearchRequest & { requesterId: string | undefined }) {
        const search = await Search.create(data)
        this.runExploration(search.public_id, data)
        return search
    }

    private async runExploration(searchId: string, criteria: SearchRequest) {
        // TODO Implementar
        // Obtiene vertices (aeropuertos) que se van a explorar
        // Chequea aristas entre los vertices (vuelos) que se conocen, y obtiene de SerpApi las necesarias
        // Ejecuta A*
        // Guarda resultados finales en Itinerary, actualiza status de Search a completed
    }

    public async getSearch(searchId: string, requesterId: string | undefined) {
        const query = requesterId
            ? { public_id: searchId, $or: [{ user_id: requesterId }, { user_id: { $exists: false } }] }
            : { public_id: searchId, user_id: { $exists: false } };

        const search = await Search.findOne(query).populate("itineraries")
        if (search == null)
            throw new SearchNotFoundError(searchId, requesterId ?? 'anonymous')

        return search
    }
}
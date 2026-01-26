import "dotenv/config";
import { injectable } from "tsyringe";
import type { ApiRequest, ApiRequestParameters, SerpApiResponse } from "./serpapi.types.js";

@injectable()
export class SerpApiClient {
    private baseUrl = "https://serpapi.com";
    private apiKey = process.env.SERPAPI_API_KEY!;

    public async search(
        parameters: ApiRequestParameters
    ): Promise<SerpApiResponse> {

        const query = new URLSearchParams({
            engine: "google_flights",
            api_key: this.apiKey,
            ...parameters as any
        });

        const response = await fetch(`${this.baseUrl}/search?${query.toString()}`);

        if (!response.ok) {
            throw new Error(`SerpApi error: ${response.status}`);
        }

        return await response.json();
    }
}

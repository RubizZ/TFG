import type { ValidationDetails, RequestValidationFailResponse, DatabaseValidationFailResponse } from "../../utils/responses.js";

export interface SearchRequest {
    /**
     * @minItems 1
     * @pattern ^[A-Z]{3}$
     */
    origins: string[];
    /**
     * @minItems 1
     * @pattern ^[A-Z]{3}$
     */
    destinations: string[];
    criteria: {
        priority: "balanced" | "cheap" | "fast";
        /**
         * @minimum 0
         */
        max_price?: number;
    };
}

export interface LegResponse {
    order: number;
    flight_id: string;
    origin: string;
    destination: string;
    price: number;
    duration: number;
}

export interface ItineraryResponse {
    search_id: string;
    score: number;
    total_price: number;
    total_duration: number;
    city_order: string[];
    legs: LegResponse[];
    /**
     * @isDateTime
     */
    created_at: string;
}

export interface SearchResponseData {
    public_id: string;
    user_id?: string;
    origins: string[];
    destinations: string[];
    criteria: {
        priority: "balanced" | "cheap" | "fast";
        max_price?: number;
    };
    status: "searching" | "completed" | "failed";
    itineraries?: ItineraryResponse[];
    /**
     * @isDateTime
     */
    created_at: string;
}

export type SearchRequestValidationFailResponse = RequestValidationFailResponse<ValidationDetails<
    | "body"
    | "body.origins"
    | "body.destinations"
    | "body.criteria"
    | "body.criteria.priority"
    | "body.criteria.max_price"
>>;

// Unión de todas las posibles respuestas 422 para search
export type SearchValidationFailResponse = SearchRequestValidationFailResponse | DatabaseValidationFailResponse;

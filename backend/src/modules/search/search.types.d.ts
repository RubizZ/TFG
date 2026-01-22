export interface SearchRequest {
    origins: string[];
    destinations: string[];
    criteria?: {
        priority: "balanced" | "cheap" | "fast";
        max_price: number;
    };
}

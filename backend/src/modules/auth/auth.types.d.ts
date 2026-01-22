export interface SafeUser {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    preferences: {
        price_weight: number;
        duration_weight: number;
        stops_weight: number;
        airline_quality_weight: number;
    };
    /**
     * @isDateTime
     */
    created_at: string;
    /**
     * @isDateTime
     */
    last_seen_at: string;
    auth_version: number;
}

export type AuthenticatedUser = SafeUser & {
    token: string;
}

export interface AuthResponse {
    userId: string;
    token: string;
    authVersion: number;
}

export interface JWTPayload {
    userId: string;
    version: number;
}
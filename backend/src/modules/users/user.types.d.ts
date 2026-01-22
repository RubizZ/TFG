export interface RegisterData {
    username: string;
    email: string;
    password: string;
    preferences?: {
        price_weight?: number;
        duration_weight?: number;
        stops_weight?: number;
        airline_quality_weight?: number;
    }
}

export interface UpdateUserData {
    username?: string;
    email?: string;
    preferences?: {
        price_weight?: number;
        duration_weight?: number;
        stops_weight?: number;
        airline_quality_weight?: number;
    }
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    message?: string;
}

export interface ApiError {
    code: string;
    message: string;
    statusCode: number;
}

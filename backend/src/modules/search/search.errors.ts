import { AppError } from "../../utils/errors.js";

export class SearchNotFoundError extends AppError {
    public readonly code: string = 'NOT_FOUND';
    public readonly statusCode: number = 404;

    constructor(searchId: string, requesterId: string) {
        super(`Search with ID ${searchId} not found for user ${requesterId}`);
    }
}   
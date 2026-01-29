import { AppError } from "../../utils/errors.js";

export class SearchNotFoundError extends AppError<'NOT_FOUND', { searchId: string; requesterId: string }> {
    public readonly code = 'NOT_FOUND';
    public readonly statusCode: number = 404;

    constructor(searchId: string, requesterId: string) {
        super(`Search with ID ${searchId} not found for user ${requesterId}`);
        this.details = { searchId, requesterId };
    }
}   
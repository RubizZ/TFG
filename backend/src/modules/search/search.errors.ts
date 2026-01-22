import { AppError } from "../../utils/errors.js";

export class SearchNotFoundError extends AppError {
    constructor(searchId: string, requesterId: string) {
        super(`Search with ID ${searchId} not found for user ${requesterId}`, 404);
    }
}
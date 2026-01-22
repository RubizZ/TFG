export class SearchNotFoundError extends Error {
    public readonly status = 404;
    constructor(searchId: string, requesterId: string) {
        super(`Search with ID ${searchId} not found for user ${requesterId}`);
        this.name = "SearchNotFoundError";
    }
}
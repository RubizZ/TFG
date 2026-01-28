export abstract class AppError extends Error {
    public abstract readonly code: string;
    public abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
    }

    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode
        };
    }
}
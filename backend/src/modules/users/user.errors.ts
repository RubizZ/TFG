import { AppError } from "../../utils/errors.js";

export class UserAlreadyExistsError extends AppError<'CONFLICT', { field: 'email' | 'username'; value: string }> {
    public readonly code = 'CONFLICT';
    public readonly statusCode: number = 409;

    constructor(identifier: string, type: 'email' | 'username') {
        super(`User with ${type} ${identifier} already exists`);
        this.details = { field: type, value: identifier };
    }
}

export class UserNotFoundError extends AppError<'NOT_FOUND', { userId: string }> {
    public readonly code = 'NOT_FOUND';
    public readonly statusCode: number = 404;

    constructor(userId: string) {
        super(`User with ID ${userId} not found`);
        this.details = { userId };
    }
}
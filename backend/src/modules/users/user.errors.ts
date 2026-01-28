import { AppError } from "../../utils/errors.js";

export class UserAlreadyExistsError extends AppError {
    public readonly code: string = 'CONFLICT';
    public readonly statusCode: number = 409;

    constructor(identifier: string, type: 'email' | 'username') {
        super(`User with ${type} ${identifier} already exists`);
    }
}

export class UserNotFoundError extends AppError {
    public readonly code: string = 'NOT_FOUND';
    public readonly statusCode: number = 404;

    constructor(userId: string) {
        super(`User with ID ${userId} not found`);
    }
}
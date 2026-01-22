import { AppError } from "../../utils/errors.js";

export class UserAlreadyExistsError extends AppError {

    constructor(identifier: string, type: 'email' | 'username') {
        super(`User with ${type} ${identifier} already exists`, 409);
    }
}

export class UserNotFoundError extends AppError {
    constructor(userId: string) {
        super(`User with ID ${userId} not found`, 404);
    }
}
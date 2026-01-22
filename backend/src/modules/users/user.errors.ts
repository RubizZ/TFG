import { AppError } from "../../utils/errors.js";

export class UserAlreadyExistsError extends AppError {

    constructor(identifier: string, type: 'email' | 'username') {
        super(`User with ${type} ${identifier} already exists`, 409);
    }
}
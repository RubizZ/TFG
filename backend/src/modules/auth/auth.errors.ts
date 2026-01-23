import { AppError } from "../../utils/errors.js";

export class AuthError extends AppError {
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}

export class UserNotFoundError extends AuthError {
    constructor(identifier: string) {
        super(`User not found for identifier: ${identifier}`, 404);
    }
}

export class InvalidPasswordError extends AuthError {
    constructor(identifier: string) {
        super(`Invalid password for identifier: ${identifier}`, 401);
    }
}

export class InvalidTokenError extends AuthError {
    constructor(detail?: string) {
        super(detail ? `Invalid token: ${detail}` : "Invalid token", 401);
    }
}

export class NoTokenProvidedError extends AuthError {
    constructor() {
        super("No token provided", 401);
    }
}

export class AuthenticationVersionMismatchError extends AuthError {
    constructor() {
        super("Authentication version mismatch. Please login again.", 401);
    }
}
export class ResetTokenInvalidOrExpiredError extends AuthError {
    constructor() {
        super("The reset token is invalid or has expired.", 400);
    }
}


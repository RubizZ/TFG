import { AppError } from "../../utils/errors.js";

export abstract class AuthError extends AppError {
    public abstract readonly code: string;
    public abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
    }
}

export class UserNotFoundError extends AuthError {
    public readonly code: string = 'USER_NOT_FOUND';
    public readonly statusCode: number = 404;
    constructor(identifier: string) {
        super(`User not found for identifier: ${identifier}`);
    }
}

export class InvalidPasswordError extends AuthError {
    public readonly code: string = 'INVALID_PASSWORD';
    public readonly statusCode: number = 401;
    constructor(identifier: string) {
        super(`Invalid password for identifier: ${identifier}`);
    }
}

export class InvalidTokenError extends AuthError {
    public readonly code: string = 'INVALID_TOKEN';
    public readonly statusCode: number = 401;
    constructor(detail?: string) {
        super(detail ? `Invalid token: ${detail}` : "Invalid token");
    }
}

export class NoTokenProvidedError extends AuthError {
    public readonly code: string = 'NO_TOKEN_PROVIDED';
    public readonly statusCode: number = 401;
    constructor() {
        super("No token provided");
    }
}

export class AuthenticationVersionMismatchError extends AuthError {
    public readonly code: string = 'AUTH_VERSION_MISMATCH';
    public readonly statusCode: number = 401;
    constructor() {
        super("Authentication version mismatch. Please login again.");
    }
}
export class ResetTokenInvalidOrExpiredError extends AuthError {
    public readonly code: string = 'RESET_TOKEN_INVALID_OR_EXPIRED';
    public readonly statusCode: number = 400;
    constructor() {
        super("The reset token is invalid or has expired.");
    }
}

export class TokenUserNotFoundError extends AuthError {
    public readonly code: string = 'TOKEN_USER_NOT_FOUND';
    public readonly statusCode: number = 401;
    constructor() {
        super("The user associated with this token no longer exists.");
    }
}

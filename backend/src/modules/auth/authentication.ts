import type { Request } from "express";
import type { AuthenticatedUser, JWTPayload } from "./auth.types.js";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model.js";
import { AuthError, AuthenticationVersionMismatchError, InvalidTokenError, NoTokenProvidedError, TokenUserNotFoundError } from "./auth.errors.js";
import type { SafeUser } from "../users/user.types.js";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function expressAuthentication(
    request: Request,
    securityName: string,
    _scopes?: string[]
): Promise<AuthenticatedUser | null> {
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    // Lógica principal de validación JWT
    const validateJWT = async () => {
        if (!headerValue || !headerValue.startsWith('Bearer ')) {
            throw new NoTokenProvidedError();
        }

        const token = headerValue.split(' ')[1];
        if (!token) {
            throw new NoTokenProvidedError();
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        const user = await User.findOne({ id: decoded.userId });
        if (!user) {
            throw new TokenUserNotFoundError();
        }

        if (user.auth_version !== decoded.version) {
            throw new AuthenticationVersionMismatchError();
        }

        user.last_seen_at = new Date();
        await user.save();

        const userObj = user.toObject();
        const safeUser = {
            id: userObj.id,
            username: userObj.username,
            email: userObj.email,
            role: userObj.role,
            preferences: userObj.preferences,
            created_at: user.created_at.toISOString(),
            last_seen_at: user.last_seen_at.toISOString(),
            auth_version: userObj.auth_version
        } satisfies SafeUser;

        return {
            ...safeUser,
            token: token,
        };
    };

    try {
        if (securityName === 'jwt') {
            return await validateJWT();
        }

        if (securityName === 'jwt-optional') {
            if (headerValue) { // Si hay token jwt, validarlo (y falla si no es válido)
                return await validateJWT();
            }
            return null; // Invitado si no hay token jwt
        }
    } catch (err) {
        if (err instanceof AuthError) {
            throw err;
        }
        const message = err instanceof Error ? err.message : undefined;
        throw new InvalidTokenError(message);
    }

    throw new Error(`Invalid security name: ${securityName}`)
}

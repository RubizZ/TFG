import type { Request } from "express";
import type { AuthenticatedUser, JWTPayload, SafeUser } from "./auth.types.js";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model.js";
import { AuthenticationVersionMismatchError, InvalidTokenError, NoTokenProvidedError, UserNotFoundError } from "./auth.errors.js";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function expressAuthentication(
    request: Request,
    securityName: string,
    _scopes?: string[]
): Promise<AuthenticatedUser | null> {
    if (securityName === 'jwt') {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new NoTokenProvidedError();
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new NoTokenProvidedError();
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new UserNotFoundError(decoded.userId);
            }

            if (user.auth_version !== decoded.version) {
                throw new AuthenticationVersionMismatchError();
            }

            user.last_seen_at = new Date();
            await user.save();

            const userObj = user.toObject();
            const safeUser = {
                _id: userObj._id.toString(),
                username: userObj.username,
                email: userObj.email,
                role: userObj.role,
                preferences: userObj.preferences,
                created_at: user.created_at.toISOString(),
                last_seen_at: user.last_seen_at.toISOString(),
                auth_version: userObj.auth_version
            } satisfies SafeUser;

            return {
                user: safeUser,
                userId: decoded.userId,
                token: token,
            };
        } catch (err) {
            if (err instanceof AuthenticationVersionMismatchError || err instanceof UserNotFoundError || err instanceof NoTokenProvidedError) {
                throw err;
            }
            const message = err instanceof Error ? err.message : undefined;
            throw new InvalidTokenError(message);
        }
    }

    if (securityName === 'bypass') {
        // Si hay un token, NO permite bypass. 
        // Esto obliga a TSOA a esperar/usar el resultado del esquema 'jwt'.
        if (request.headers['authorization']) {
            throw new Error("Token present, skipping bypass to use JWT authentication");
        }
        return null;
    }

    throw new Error(`Invalid security name: ${securityName}`)
}

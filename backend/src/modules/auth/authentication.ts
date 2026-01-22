import type { Request } from "express";
import type { AuthenticatedUser } from "./auth.types.js";

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
): Promise<AuthenticatedUser | null> {
    if (securityName === 'bearerAuth') {
        // TODO
        return null
    }

    if (securityName === 'bypass') {
        return null
    }

    throw new Error(`Invalid security name: ${securityName}`)
}
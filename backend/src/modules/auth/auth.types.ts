import type { ValidationDetails, ValidationFailResponse } from "../../utils/responses.js";
import type { SafeUser } from "../users/user.types.js";

// ==================== TIPOS DE AUTENTICACIÓN ====================

export interface AuthenticatedUser extends SafeUser {
    token: string;
}

/**
 * Respuesta del endpoint POST /auth/login
 */
export interface LoginResponseData {
    userId: string;
    token: string;
    authVersion: number;
}

export interface JWTPayload {
    userId: string;
    version: number;
}

// ==================== REQUEST BODIES ====================

export interface LoginRequest {
    /**
     * @minLength 3
     */
    identifier: string;
    /**
     * @minLength 8
     */
    password: string;
}

export interface ChangePasswordRequest {
    /**
     * @minLength 8
     */
    oldPassword: string;
    /**
     * @minLength 8
     */
    newPassword: string;
}

export interface ForgotPasswordRequest {
    /**
     * @format email
     * @pattern ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
     */
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    /**
     * @minLength 8
     */
    newPassword: string;
}

// ==================== VALIDATION FAIL RESPONSES (422) ====================

export type LoginValidationFailResponse = ValidationFailResponse<ValidationDetails<
    | "body"
    | "body.identifier"
    | "body.password"
>>;

export type ChangePasswordValidationFailResponse = ValidationFailResponse<ValidationDetails<
    | "body"
    | "body.oldPassword"
    | "body.newPassword"
>>;

export type ForgotPasswordValidationFailResponse = ValidationFailResponse<ValidationDetails<
    | "body"
    | "body.email"
>>;

export type ResetPasswordValidationFailResponse = ValidationFailResponse<ValidationDetails<
    | "body"
    | "body.token"
    | "body.newPassword"
>>;

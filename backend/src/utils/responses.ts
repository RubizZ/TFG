// ==================== RESPUESTAS DE ÉXITO ====================

/**
 * Wrapper de éxito JSend (aplicado por el middleware global).
 */
export interface SuccessResponse<T> {
    status: 'success';
    data: T;
}

/**
 * Respuesta de éxito solo con mensaje (sin datos).
 * El wrapper global lo convertirá en: { status: 'success', data: { message: string } }
 */
export interface MessageResponseData {
    message: string;
}

// ==================== RESPUESTAS DE ERROR ====================

export interface FailResponse<TCode extends string | null = null> {
    status: 'fail';
    data: {
        message: string;
        code: TCode;
    };
}

/**
 * Tipo de respuesta para errores de autenticación JWT (401).
 * Cubre todos los errores lanzados por expressAuthentication:
 * - NO_TOKEN_PROVIDED: No se proporcionó token
 * - INVALID_TOKEN: Token inválido o expirado
 * - TOKEN_USER_NOT_FOUND: Usuario del token ya no existe
 * - AUTH_VERSION_MISMATCH: Sesión invalidada (logoutAll)
 */
export type AuthFailResponse = FailResponse<
    | 'NO_TOKEN_PROVIDED'
    | 'INVALID_TOKEN'
    | 'TOKEN_USER_NOT_FOUND'
    | 'AUTH_VERSION_MISMATCH'
>;

export interface FailResponseWithDetails<TCode extends string | null = null, TDetails = undefined> {
    status: 'fail';
    data: {
        message: string;
        code: TCode;
        details: TDetails;
    };
}

// Patrón para las claves de detalle de validación (el "regex" de TypeScript)
type ValidationKey = `body.${string}` | `query.${string}` | `path.${string}` | `header.${string}` | `formData.${string}` | `body` | `query` | `path` | `header` | `formData`;

/**
 * Generador de estructura de detalles.
 * Transforma una unión de llaves ('body' | 'body.id') en el objeto que TSOA espera.
 */
export type ValidationDetails<K extends ValidationKey> = {
    [P in K]?: { message: string };
};

export type ValidationFailResponse<
    TDetails extends { [K in keyof TDetails]: K extends ValidationKey ? { message: string } : never } | undefined = undefined,
> = {
    status: 'fail';
    data: {
        code: 'VALIDATION_ERROR';
        message: string;
        details: TDetails;
    };
};
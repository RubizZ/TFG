import { Body, Controller, Post, RequestProp, Response, Route, Security, Tags } from "tsoa";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service.js";
import type { AuthenticatedUser, ChangePasswordRequest, ChangePasswordValidationFailResponse, ForgotPasswordRequest, ForgotPasswordValidationFailResponse, LoginRequest, LoginResponseData, LoginValidationFailResponse, ResetPasswordRequest, ResetPasswordValidationFailResponse } from "./auth.types.js";
import type { AuthFailResponse, FailResponse, MessageResponseData, SuccessResponse } from "../../utils/responses.js";

@injectable()
@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
    constructor(@inject(AuthService) private authService: AuthService) {
        super()
    }

    /**
     * Inicia sesión con un identificador (email o username) y contraseña.
     */
    @Post("/login")
    @Response<LoginValidationFailResponse>(422, "Error de validación en los datos de inicio de sesión")
    @Response<FailResponse<'INVALID_PASSWORD'>>(401, "Credenciales inválidas")
    public async login(@Body() body: LoginRequest): Promise<SuccessResponse<LoginResponseData>> {
        const { identifier, password } = body;
        return await this.authService.login(identifier, password) satisfies LoginResponseData as any;
    }

    /**
     * Cierra todas las sesiones activas del usuario (invalida todos los tokens).
     */
    @Post("/logoutAll")
    @Security("jwt")
    @Response<AuthFailResponse>(401, "No autenticado")
    public async logoutAll(@RequestProp("user") user: AuthenticatedUser): Promise<SuccessResponse<MessageResponseData>> {
        await this.authService.logoutAll(user.id);
        return {
            message: "Sesiones cerradas correctamente."
        } satisfies MessageResponseData as any;
    }

    /**
     * Cambia la contraseña del usuario autenticado.
     */
    @Post("/change-password")
    @Security("jwt")
    @Response<ChangePasswordValidationFailResponse>(422, "Error de validación en el cambio de contraseña")
    @Response<AuthFailResponse>(401, "No autenticado")
    @Response<FailResponse<'INVALID_PASSWORD'>>(401, "Contraseña incorrecta")
    @Response<FailResponse<'USER_NOT_FOUND'>>(404, "Usuario no encontrado")
    public async changePassword(@RequestProp("user") user: AuthenticatedUser, @Body() body: ChangePasswordRequest): Promise<SuccessResponse<MessageResponseData>> {
        const { oldPassword, newPassword } = body;
        await this.authService.changePassword(user.id, oldPassword, newPassword);
        return {
            message: "Contraseña cambiada correctamente."
        } satisfies MessageResponseData as any;
    }

    /**
     * Solicita un email de recuperación de contraseña.
     * Por seguridad, siempre devuelve éxito aunque el email no exista.
     */
    @Post("/forgot-password")
    @Response<ForgotPasswordValidationFailResponse>(422, "Error de validación en el email proporcionado")
    public async forgotPassword(@Body() body: ForgotPasswordRequest): Promise<SuccessResponse<MessageResponseData>> {
        const { email } = body;
        await this.authService.forgotPassword(email);
        return {
            message: "Si existe un usuario asociado a esa cuenta, se ha enviado un email de recuperación."
        } satisfies MessageResponseData as any;
    }

    /**
     * Restablece la contraseña usando un token de recuperación.
     */
    @Post("/reset-password")
    @Response<ResetPasswordValidationFailResponse>(422, "Error de validación en los datos de restablecimiento")
    @Response<FailResponse<'RESET_TOKEN_INVALID_OR_EXPIRED'>>(400, "Token inválido o expirado")
    public async resetPassword(@Body() body: ResetPasswordRequest): Promise<SuccessResponse<MessageResponseData>> {
        const { token, newPassword } = body;
        await this.authService.resetPassword(token, newPassword);
        return {
            message: "Contraseña restablecida correctamente."
        } satisfies MessageResponseData as any;
    }
}

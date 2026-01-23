import { Body, Controller, Post, RequestProp, Route, Security } from "tsoa";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service.js";
import type { AuthenticatedUser } from "./auth.types.js";

@injectable()
@Route("auth")
export class AuthController extends Controller {
    constructor(@inject(AuthService) private authService: AuthService) {
        super()
    }

    @Post("/login")
    public async login(@Body() body: { identifier: string; password: string }) {
        const { identifier, password } = body;
        return await this.authService.login(identifier, password);
    }

    @Post("/logoutAll")
    @Security("jwt")
    public async logoutAll(@RequestProp("user") user: AuthenticatedUser) {
        await this.authService.logoutAll(user.id);
        return { message: "Sesiones cerradas correctamente." };
    }

    @Post("/change-password")
    @Security("jwt")
    public async changePassword(@RequestProp("user") user: AuthenticatedUser, @Body() body: { oldPassword: string; newPassword: string }) {
        const { oldPassword, newPassword, } = body;
        await this.authService.changePassword(user.id, oldPassword, newPassword);
        return { message: "Contraseña cambiada correctamente." };
    }

    @Post("/forgot-password")
    public async forgotPassword(@Body() body: { email: string }) {
        const { email } = body;
        await this.authService.forgotPassword(email);
        return { message: "Si existe un usuario asociado a esa cuenta, se ha enviado un email de recuperación." };
    }

    @Post("/reset-password")
    public async resetPassword(@Body() body: { token: string; newPassword: string }) {
        const { token, newPassword } = body;
        await this.authService.resetPassword(token, newPassword);
        return { message: "Contraseña restablecida correctamente." };
    }
}

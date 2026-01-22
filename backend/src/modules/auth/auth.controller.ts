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
        return await this.authService.logoutAll(user.id);
    }
}
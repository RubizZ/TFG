import { Body, Controller, Get, Post, RequestProp, Route, Security } from "tsoa";
import type { RegisterData } from "./user.types.js";
import { inject, injectable } from "tsyringe";
import { UserService } from "./user.service.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";

@injectable()
@Route("users")
export class UsersController extends Controller {

    constructor(@inject(UserService) private userService: UserService) {
        super();
    }

    @Post("/")
    public async createUser(@Body() body: RegisterData) {
        const user = await this.userService.createUser(body);
        this.setStatus(201);
        return user;
    }

    @Get("/me")
    @Security("jwt")
    public async getUser(@RequestProp('user') user: AuthenticatedUser) {
        return user.user;
    }
}
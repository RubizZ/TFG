import { Body, Controller, Get, Patch, Post, RequestProp, Route, Security } from "tsoa";
import type { RegisterData, UpdateUserData } from "./user.types.js";
import { inject, injectable } from "tsyringe";
import { UserService } from "./user.service.js";
import type { AuthenticatedUser, SafeUser } from "../auth/auth.types.js";
import type { IUser } from "./user.model.js";

@injectable()
@Route("users")
export class UsersController extends Controller {

    constructor(@inject(UserService) private userService: UserService) {
        super();
    }

    @Post("/")
    public async createUser(@Body() body: RegisterData): Promise<SafeUser> {
        const user = await this.userService.createUser(body);
        this.setStatus(201);
        return this.sanitizeUser(user);
    }

    @Get("/me")
    @Security("jwt")
    public getUser(@RequestProp('user') user: AuthenticatedUser): SafeUser {
        const { token, ...cleanUser } = user;
        return cleanUser;
    }

    @Patch("/me")
    @Security("jwt")
    public async updateUser(@RequestProp('user') user: AuthenticatedUser, @Body() body: UpdateUserData): Promise<SafeUser> {
        const updatedUser = await this.userService.updateUser(user.id, body);
        return this.sanitizeUser(updatedUser);
    }

    private sanitizeUser(user: IUser): SafeUser {
        const { password, ...cleanUser } = user;
        return {
            ...cleanUser,
            created_at: cleanUser.created_at.toISOString(),
            last_seen_at: cleanUser.last_seen_at.toISOString()
        };
    }

}
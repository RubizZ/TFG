import { Body, Controller, Get, Post, Route } from "tsoa";
import { User } from "./user.model.js";

@Route("users")
export class UsersController extends Controller {

    @Post("/")
    public async createUser(@Body() body: any) {
        const user = await User.create(body);
        return user;
    }
}
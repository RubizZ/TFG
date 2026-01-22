import { singleton } from "tsyringe";
import type { HydratedDocument } from "mongoose";
import type { RegisterData, UpdateUserData } from "./user.types.js";
import { User, type IUser } from "./user.model.js";
import { PasswordService } from "../auth/auth.service.js";
import { UserAlreadyExistsError, UserNotFoundError } from "./user.errors.js";

@singleton()
export class UserService {
    public async createUser(data: RegisterData): Promise<IUser> {
        try {
            return this.sanitizeUser(await User.create({
                ...data,
                password: PasswordService.hashPassword(data.password)
            }));
        } catch (error: any) {
            if (error.name === 'MongoServerError' && error.code === 11000) { // MongoDB duplicate key error
                const field = Object.keys(error.keyValue)[0] as 'username' | 'email';
                throw new UserAlreadyExistsError(error.keyValue[field], field);
            }
            throw error;
        }
    }

    public async updateUser(userId: string, data: UpdateUserData): Promise<IUser> {
        try {
            const updatedUser = await User.findOneAndUpdate({ id: userId }, data, { new: true });
            if (!updatedUser) {
                throw new UserNotFoundError(userId);
            }
            return this.sanitizeUser(updatedUser);
        } catch (error: any) {
            if (error.name === 'MongoServerError' && error.code === 11000) { // MongoDB duplicate key error
                const field = Object.keys(error.keyValue)[0] as 'username' | 'email';
                throw new UserAlreadyExistsError(error.keyValue[field], field);
            }
            throw error;
        }
    }

    private sanitizeUser(user: HydratedDocument<IUser>): IUser {
        const { _id, __v, ...cleanUser } = user.toObject();
        return cleanUser;
    }
} 
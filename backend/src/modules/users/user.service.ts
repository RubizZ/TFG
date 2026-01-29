import { singleton } from "tsyringe";
import type { HydratedDocument } from "mongoose";
import type { RegisterData, UpdateUserData } from "./user.types.js";
import { User, type IUser } from "./user.model.js";
import { PasswordService } from "../auth/auth.service.js";
import { UserNotFoundError, UserAlreadyExistsError } from "./user.errors.js";

@singleton()
export class UserService {

    public async createUser(data: RegisterData): Promise<IUser> {
        try {
            return this.sanitizeUser(await User.create({
                ...data,
                password: PasswordService.hashPassword(data.password)
            }));
        } catch (error: any) {
            // Duplicate key error de MongoDB (código 11000)
            // Ocurre cuando se viola una restricción unique en la BD
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const field = Object.keys(error.keyValue || {})[0] as 'username' | 'email' | undefined;
                if (field) {
                    throw new UserAlreadyExistsError(error.keyValue[field], field);
                }
            }
            // Propagar ValidationError y otros errores
            throw error;
        }
    }

    public async updateUser(userId: string, data: UpdateUserData): Promise<IUser> {
        try {
            const updatedUser = await User.findOneAndUpdate({ id: userId }, data, { new: true, runValidators: true });
            if (!updatedUser) {
                throw new UserNotFoundError(userId);
            }
            return this.sanitizeUser(updatedUser);
        } catch (error: any) {
            if (error instanceof UserNotFoundError) throw error;
            
            // Duplicate key error de MongoDB
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const field = Object.keys(error.keyValue || {})[0] as 'username' | 'email' | undefined;
                if (field) {
                    throw new UserAlreadyExistsError(error.keyValue[field], field);
                }
            }
            // Propagar ValidationError y otros errores
            throw error;
        }
    }

    private sanitizeUser(user: HydratedDocument<IUser>): IUser {
        const { _id, __v, ...cleanUser } = user.toObject();
        return cleanUser;
    }
} 
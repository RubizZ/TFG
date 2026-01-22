import { singleton } from "tsyringe";
import type { RegisterData } from "./user.types.js";
import { User } from "./user.model.js";
import { PasswordService } from "../auth/auth.service.js";
import { UserAlreadyExistsError } from "./user.errors.js";
import type { SafeUser } from "../auth/auth.types.js";

@singleton()
export class UserService {
    public async createUser(data: RegisterData): Promise<SafeUser> {
        try {
            const user = await User.create({
                ...data,
                password: PasswordService.hashPassword(data.password)
            });
            const userObj = user.toObject();
            const { password, ...safeUser } = userObj;
            return { ...safeUser, _id: userObj._id.toString() };
        } catch (error: any) {
            if (error.name === 'MongoServerError' && error.code === 11000) { // MongoDB duplicate key error
                const field = Object.keys(error.keyValue)[0] as 'username' | 'email';
                throw new UserAlreadyExistsError(error.keyValue[field], field);
            }
            throw error;
        }
    }
} 
import { singleton } from "tsyringe";
import { User } from "../users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from 'ms'
import { InvalidPasswordError, UserNotFoundError } from "./auth.errors.js";
import type { AuthResponse, JWTPayload } from "./auth.types.js";

export class PasswordService {
    public static hashPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    public static comparePassword(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }
}

@singleton()
export class AuthService {
    private readonly jwtSecret: string;
    private readonly jwtExpiration: number;

    constructor() {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpiration = process.env.JWT_EXPIRATION ? Math.floor(ms(process.env.JWT_EXPIRATION as ms.StringValue) / 1000) : 2592000; // Default to 30 days
    }

    public async login(identifier: string, password: string): Promise<AuthResponse> {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] })

        if (!user) {
            throw new UserNotFoundError(identifier);
        }

        const isPasswordMatch = PasswordService.comparePassword(password, user.password);

        if (!isPasswordMatch) {
            throw new InvalidPasswordError(identifier);
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                version: user.auth_version
            } as JWTPayload,
            this.jwtSecret,
            { expiresIn: this.jwtExpiration }
        );

        return {
            userId: user._id.toString(),
            token,
            authVersion: user.auth_version
        };
    }

    public async logoutAll(userId: string) {
        await User.updateOne({ _id: userId }, { $inc: { auth_version: 1 } });
    }
}
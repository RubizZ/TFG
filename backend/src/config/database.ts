import mongoose from "mongoose";
import { User } from "../modules/users/user.model.js";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectDB(): Promise<void> {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected: ", conn.connection.host);
        await User.syncIndexes();
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        process.exit(1);
    }
}
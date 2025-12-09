import { Schema, model } from "mongoose";

export interface IUser {
  nombre: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const User = model<IUser>('User', UserSchema);
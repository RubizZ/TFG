import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  preferences: {
    price_weight: number;
    duration_weight: number;
    stops_weight: number;
    airline_quality_weight: number;
  };
  created_at: Date;
  last_seen_at: Date;
  auth_version: number;
}

const UserSchema = new Schema<IUser>({
  id: { type: String, default: () => randomUUID(), unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  preferences: {
    price_weight: { type: Number, default: 0.4 },
    duration_weight: { type: Number, default: 0.2 },
    stops_weight: { type: Number, default: 0.2 },
    airline_quality_weight: { type: Number, default: 0.2 },
  },
  created_at: { type: Date, default: Date.now },
  last_seen_at: { type: Date, default: Date.now },
  auth_version: { type: Number, default: 1 }
});

export const User = model<IUser>("User", UserSchema);
import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  preferences: {
    price_weigth: number;
    duration_weight: number;
    stops_weigth: number;
    airline_quality_weight: number;
  };
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  preferences: {
    price_weight: { type: Number, default: 0.4},
    duration_weight: { type: Number, default: 0.2 },
    stops_weigth: { type: Number, default: 0.2 },
    airline_quality_weight: { type: Number, default: 0.2 },
  },
  created_at: { type: Date, default: Date.now }
});

export const User = model<IUser>("User", UserSchema);
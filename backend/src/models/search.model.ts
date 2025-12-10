import { Schema, model } from "mongoose";

export interface ISearch {
  user_id: string;
  origin: string;
  destinations: string[];
  criteria: {
    priority: "balanced" | "cheap" | "fast";
    max_price: number;
  };
  created_at: Date;
}

const SearchSchema = new Schema<ISearch>({
  user_id: { type: String, ref: "User", required: true },
  origin: { type: String, required: true },
  destinations: [{ type: String, required: true }],
  criteria: {
    priority: { type: String, default: "balanced" },
    max_price: { type: Number, required: false }
  },
  created_at: { type: Date, default: Date.now }
});

export const Search = model<ISearch>("Search", SearchSchema);

import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";

import type { IItinerary } from "./itinerary.model.js";

export interface ISearch {
  public_id: string;
  user_id?: string;
  origins: string[];
  destinations: string[];
  criteria: {
    priority: "balanced" | "cheap" | "fast";
    max_price?: number;
  };
  status: "searching" | "completed" | "failed";
  itineraries?: IItinerary[];
  created_at: Date;
}

const SearchSchema = new Schema<ISearch>({
  public_id: { type: String, default: () => randomUUID(), unique: true, index: true },
  user_id: { type: String, ref: "User", required: false },
  origins: [{ type: String, required: true }],
  destinations: [{ type: String, required: true }],
  criteria: {
    priority: { type: String, enum: ["balanced", "cheap", "fast"], default: "balanced" },
    max_price: { type: Number, required: false }
  },
  status: { type: String, enum: ["searching", "completed", "failed"], default: "searching" },
  created_at: { type: Date, default: Date.now }
}, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete (ret as any)._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete (ret as any)._id;
      return ret;
    }
  },
  id: false
});

SearchSchema.virtual('itineraries', {
  ref: 'Itinerary',
  localField: 'public_id',
  foreignField: 'search_id'
});


export const Search = model<ISearch>("Search", SearchSchema);

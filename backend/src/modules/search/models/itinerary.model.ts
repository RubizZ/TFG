import { Schema, model } from "mongoose";

export interface ILeg {
  order: number;
  flight_id: string;
  origin: string;
  destination: string;
  price: number;
  duration: number;
}

export interface IItinerary {
  search_id: string;
  score: number;
  total_price: number;
  total_duration: number;
  city_order: string[];
  legs: ILeg[];
  created_at: Date;
}

const LegSchema = new Schema<ILeg>({
  order: { type: Number, required: true },
  flight_id: { type: String, ref: "Flight", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }
});

const ItinerarySchema = new Schema<IItinerary>({
  search_id: { type: String, ref: "Search", required: true },
  score: { type: Number, required: true },
  total_price: { type: Number, required: true },
  total_duration: { type: Number, required: true },
  city_order: [String],
  legs: [LegSchema],
  created_at: { type: Date, default: Date.now }
}, {
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      delete (ret as any)._id;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      delete (ret as any)._id;
      return ret;
    }
  },
  id: false
});

export const Itinerary = model<IItinerary>("Itinerary", ItinerarySchema);

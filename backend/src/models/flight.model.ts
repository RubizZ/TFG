import { Schema, model } from "mongoose";

export interface IFlight {
  airline: string;
  airline_code: string;
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  price: number;
  duration: number;
  quality_score: number;
}

const FlightSchema = new Schema<IFlight>({
  airline: { type: String, required: true },
  airline_code: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departure: { type: Date, required: true },
  arrival: { type: Date, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  quality_score: { type: Number, required: true }
});

export const Flight = model<IFlight>("Flight", FlightSchema);

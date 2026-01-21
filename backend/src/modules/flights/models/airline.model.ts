import { Schema, model } from "mongoose";

export interface IAirline {
  name: string;
  country: string;
  quality_score: number;
}

const AirlineSchema = new Schema<IAirline>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  quality_score: { type: Number, required: true }
});

export const Airline = model<IAirline>("Airline", AirlineSchema);

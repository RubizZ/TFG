import { Schema, model } from "mongoose";

export interface IAirline {
  name: string;
  iata_code?: string;
  icao_code?: string;
  country: string;
  quality_score?: number;
}

const AirlineSchema = new Schema<IAirline>({
  name: { type: String, required: true },
  iata_code: { type: String, index: true },
  icao_code: { type: String, index: true },
  country: { type: String, required: true },
  quality_score: { type: Number },
});

export const Airline = model<IAirline>("Airline", AirlineSchema);

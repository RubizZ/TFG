import { Schema, model } from "mongoose";

export interface IAirport {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

const AirportSchema = new Schema<IAirport>({
  city: { type: String, required: true },
  country: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

export const Airport = model<IAirport>("Airport", AirportSchema);

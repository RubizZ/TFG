import { Schema, model } from "mongoose";

export interface IAirport {
  iata_code: string;
  name: string;
  city: string;
  country: string;
  type: string;
  importance_score: number;
  location: {
    type: "Point";
    coordinates: [number, number];
  }
}


const AirportSchema = new Schema<IAirport>({
  iata_code: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  type: { type: String, enum: ['large_airport', 'medium_airport', 'small_airport', 'closed'], required: true },
  importance_score: { type: Number, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  }
});

AirportSchema.index({ location: "2dsphere" });

export const Airport = model<IAirport>("Airport", AirportSchema);

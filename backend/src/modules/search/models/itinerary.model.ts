import { Schema, model } from "mongoose";
import idValidator from "../../../utils/mongoose-id-validator.js";

export interface ILeg {
  order: number;
  flight_id: string;
  origin: string;
  destination: string;
  price: number;
  duration: number;
}

export interface IItinerary {
  score: number;
  total_price: number;
  total_duration: number;
  city_order: string[];
  legs: ILeg[];
  created_at: Date;
}

const LegSchema = new Schema<ILeg>({
  order: {
    type: Number,
    required: true,
    min: [0, "El orden no puede ser negativo"]
  },
  flight_id: {
    type: String,
    ref: "Flight",
    required: true
  },
  origin: {
    type: String,
    ref: "Airport",
    refField: "iata_code",
    required: true,
    uppercase: true,
    match: [/^[A-Z]{3}$/, "El origen debe ser código IATA válido"]
  },
  destination: {
    type: String,
    ref: "Airport",
    refField: "iata_code",
    required: true,
    uppercase: true,
    match: [/^[A-Z]{3}$/, "El destino debe ser código IATA válido"]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "El precio no puede ser negativo"]
  },
  duration: {
    type: Number,
    required: true,
    min: [0, "La duración no puede ser negativa"]
  }
});

const ItinerarySchema = new Schema<IItinerary>({
  score: {
    type: Number,
    required: true,
    min: [0, "El score no puede ser negativo"],
    max: [10, "El score no puede exceder 10"]
  },
  total_price: {
    type: Number,
    required: true,
    min: [0, "El precio no puede ser negativo"]
  },
  total_duration: {
    type: Number,
    required: true,
    min: [0, "La duración no puede ser negativa"]
  },
  city_order: [{
    type: String,
    ref: "Airport",
    refField: "iata_code",
    required: true,
    uppercase: true,
    match: [/^[A-Z]{3}$/, "Cada aeropuerto debe ser código IATA válido"]
  }],
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

ItinerarySchema.plugin(idValidator);

export const Itinerary = model<IItinerary>("Itinerary", ItinerarySchema);

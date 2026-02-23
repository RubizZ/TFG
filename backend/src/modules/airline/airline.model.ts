import { Schema, model } from "mongoose";

export interface IAirline {
  code: string;
  name: string;
  country: string;
  quality_score: number;
  created_at: Date;
  updated_at: Date;
}

const AirlineSchema = new Schema<IAirline>({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    match: [/^[A-Z0-9]{2,3}$/, "El código debe tener 2-3 caracteres alfanuméricos"]
  },
  name: { 
    type: String, 
    required: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [100, "El nombre no puede exceder 100 caracteres"]
  },
  country: { 
    type: String, 
    required: true,
    minlength: [2, "El país debe tener al menos 2 caracteres"],
    maxlength: [100, "El país no puede exceder 100 caracteres"]
  },
  quality_score: { 
    type: Number, 
    required: true,
    min: [0, "El score no puede ser negativo"],
    max: [10, "El score no puede exceder 10"]
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Airline = model<IAirline>("Airline", AirlineSchema);

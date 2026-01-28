import { Schema, model } from "mongoose";
import idValidator from "mongoose-id-validator";

export interface IFlight {
  airline_code: string;
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  price: number;
  duration: number;
  quality_score: number;
  created_at: Date;
  updated_at: Date;
}

const FlightSchema = new Schema<IFlight>({
  airline_code: { 
    type: String, 
    ref: "Airline",
    required: true,
    uppercase: true,
    match: [/^[A-Z0-9]{2,3}$/, "El código debe tener 2-3 caracteres alfanuméricos"]
  },
  origin: { 
    type: String, 
    ref: "Airport",
    required: true,
    uppercase: true,
    match: [/^[A-Z]{3}$/, "El código de origen debe ser IATA válido"]
  },
  destination: { 
    type: String, 
    ref: "Airport",
    required: true,
    uppercase: true,
    match: [/^[A-Z]{3}$/, "El código de destino debe ser IATA válido"]
  },
  departure: { 
    type: Date, 
    required: true
  },
  arrival: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(this: any, v: Date) {
        return v > this.departure;
      },
      message: "La fecha de llegada debe ser posterior a la salida"
    }
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
  },
  quality_score: { 
    type: Number, 
    required: true,
    min: [0, "El score no puede ser negativo"],
    max: [10, "El score no puede exceder 10"]
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

FlightSchema.plugin(idValidator, {
  message: "{PATH} '{VALUE}' no existe en {REF}"
});

export const Flight = model<IFlight>("Flight", FlightSchema);

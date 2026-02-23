import { Airport } from "../airport/airport.model.js";

interface AirportDoc {
  iata_code: string;
  importance_score: number;
  location: {
    coordinates: [number, number]; // [lon, lat]
  };
}

interface ScoredAirport {
  iata: string;
  score: number;
}

// Radios base (km)
const MIN_RADIUS_KM = 150;
const MAX_RADIUS_KM = 800;

// Cuántas escalas máximas devolvemos
const MAX_LAYOVERS = 6;

export async function getCandidateLayovers(
  originIata: string,
  destinationIata: string
): Promise<string[]> {
  try {
    if (!originIata || !destinationIata) return [];

    const origin = await Airport.findOne({ iata_code: originIata }).lean<AirportDoc>();
    const destination = await Airport.findOne({ iata_code: destinationIata }).lean<AirportDoc>();

    if (!origin || !destination) return [];

    const [oLon, oLat] = origin.location.coordinates;
    const [dLon, dLat] = destination.location.coordinates;

    const totalDistance = haversine(oLat, oLon, dLat, dLon);

    const radius = computeAdaptiveRadius(totalDistance);

    const midLat = (oLat + dLat) / 2;
    const midLon = (oLon + dLon) / 2;

    const candidates = await Airport.find({
      iata_code: { $nin: [originIata, destinationIata] },
      location: {
        $geoWithin: {
          $centerSphere: [[midLon, midLat], radius / 6371],
        },
      },
    })
      .lean<AirportDoc[]>()
      .limit(50);

    const scored = candidates.map((a: AirportDoc): ScoredAirport => {
      const [lon, lat] = a.location.coordinates;

      const dOrigin = haversine(oLat, oLon, lat, lon);
      const dDest = haversine(dLat, dLon, lat, lon);

      return {
        iata: a.iata_code,
        score: computeScore({
          totalDistance,
          dOrigin,
          dDest,
          importance: a.importance_score,
        }),
      };
    });

    return scored
      .sort((a: ScoredAirport, b: ScoredAirport) => b.score - a.score)
      .slice(0, MAX_LAYOVERS)
      .map((a: ScoredAirport) => a.iata);

  } catch (error) {
    console.error("getCandidateLayovers failed:", error);
    return [];
  }
}

function computeScore(params: {
  totalDistance: number;
  dOrigin: number;
  dDest: number;
  importance: number;
}): number {
  const { totalDistance, dOrigin, dDest, importance } = params;

  const detourPenalty = (dOrigin + dDest) / totalDistance;

  return (
    importance * 2 -
    detourPenalty * 100
  );
}

function computeAdaptiveRadius(distanceKm: number): number {
  if (distanceKm < 800) return MIN_RADIUS_KM;
  if (distanceKm > 8000) return MAX_RADIUS_KM;

  const factor = distanceKm / 8000;
  return MIN_RADIUS_KM + factor * (MAX_RADIUS_KM - MIN_RADIUS_KM);
}


function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const toRad = (d: number) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}
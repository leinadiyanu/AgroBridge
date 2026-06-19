import axios from "axios";
import { AppError } from "../../shared/middleware/index.js";

const ORS_BASE_URL = "https://api.openrouteservice.org";
const ORS_API_KEY = process.env.ORS_API_KEY;

const FEE_PER_KM = 150; // ₦150/km — adjust based on your market research
const BASE_FEE = 500; // flat ₦500 base fee for AgroBridge delivery

interface Coordinates {
  lat: number;
  lng: number;
}

export class LogisticsService {
  // ── Geocode a location string to coordinates ───────────────────────────────

  async geocode(location: string): Promise<Coordinates> {
    try {
      const { data } = await axios.get(`${ORS_BASE_URL}/geocode/search`, {
        params: {
          api_key: ORS_API_KEY,
          text: `${location}, Nigeria`,
          size: 1,
        },
      });

      const feature = data.features?.[0];
      if (!feature) {
        throw new AppError(`Could not find location: ${location}`, 400);
      }

      const [lng, lat] = feature.geometry.coordinates;
      return { lat, lng };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError("Location lookup failed", 503);
    }
  }

  // ── Calculate driving distance between two locations ──────────────────────

  async calculateDistance(
    fromLocation: string,
    toLocation: string,
  ): Promise<number> {
    const from = await this.geocode(fromLocation);
    const to = await this.geocode(toLocation);

    if (!ORS_API_KEY) {
  throw new AppError("Missing required environment variable: ORS_API_KEY", 500);
}

    try {
      const { data } = await axios.post(
        `${ORS_BASE_URL}/v2/directions/driving-car`,
        {
          coordinates: [
            [from.lng, from.lat],
            [to.lng, to.lat],
          ],
        },
        {
          headers: { Authorization: ORS_API_KEY },
        },
      );

      const distanceMeters = data.routes[0].summary.distance;
      return Math.round(distanceMeters / 1000); // convert to km
    } catch {
      // fallback — straight-line estimate if routing fails (e.g. no road data)
      return this.haversineDistance(from, to);
    }
  }

  // ── Fallback: straight-line distance (Haversine formula) ──────────────────

  private haversineDistance(from: Coordinates, to: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(to.lat - from.lat);
    const dLng = this.toRad(to.lng - from.lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(from.lat)) *
        Math.cos(this.toRad(to.lat)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  // ── Calculate delivery fee based on distance ───────────────────────────────

  calculateDeliveryFee(distanceKm: number): number {
    return Math.round(BASE_FEE + distanceKm * FEE_PER_KM);
  }

  // ── Full quote — distance + fee in one call ────────────────────────────────

  async getDeliveryQuote(fromLocation: string, toLocation: string) {
    const distance = await this.calculateDistance(fromLocation, toLocation);
    const fee = this.calculateDeliveryFee(distance);
    return { distance, fee };
  }
}

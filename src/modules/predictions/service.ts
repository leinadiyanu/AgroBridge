import axios from "axios";
import { prisma } from "../../config/db.js";
import { AppError } from "../../shared/middleware/index.js";
import type {
  PredictInput,
  PredictOutput,
  BestTimeOutput,
  PredictRequestInput,
} from "./types.js";

const ML_BASE_URL = "https://agrobridge-api.onrender.com";

export class PredictionService {

  // ── Build input from PriceRecord history ──────────────────────────────────

  private async buildInput(commodity: string, state: string): Promise<PredictInput> {
    const now = new Date();

    const records = await prisma.priceRecord.findMany({
      where: { crop: { equals: commodity, mode: "insensitive" } },
      orderBy: { recordedAt: "desc" },
      take: 3,
    });

    const prices = records.map((r) => r.price);
    const lag1 = prices[0] ?? 0;
    const lag3 = prices[2] ?? prices[0] ?? 0;
    const rolling_mean3 =
      prices.length > 0
        ? prices.reduce((a, b) => a + b, 0) / prices.length
        : 0;

    return {
      commodity,
      state,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      lag1,
      lag3,
      rolling_mean3,
      min_dist_s: 160.25,  // update when geo data is available
      mean_dist_s: 659.08, // update when geo data is available
    };
  }

  // ── Price prediction ───────────────────────────────────────────────────────

  async predict(input: PredictRequestInput): Promise<PredictOutput> {
    if (!input.commodity || !input.state) {
      throw new AppError("Commodity and state are required", 400);
    }

    const mlInput = await this.buildInput(input.commodity, input.state);

    try {
      const { data } = await axios.post<PredictOutput>(
        `${ML_BASE_URL}/predict`,
        mlInput,
      );
      return data;
    } catch {
      throw new AppError(
        "Price prediction unavailable. Please try again later.",
        503,
      );
    }
  }

  // ── Best time to sell ──────────────────────────────────────────────────────

  async bestTime(commodity: string): Promise<BestTimeOutput> {
    if (!commodity) {
      throw new AppError("Commodity is required", 400);
    }

    try {
      const { data } = await axios.get<BestTimeOutput>(
        `${ML_BASE_URL}/best-time/${encodeURIComponent(commodity)}`,
      );
      return data;
    } catch {
      throw new AppError(
        "Could not fetch best time to sell. Please try again later.",
        503,
      );
    }
  }

  // ── Health check ───────────────────────────────────────────────────────────

  async isHealthy(): Promise<boolean> {
    try {
      const { data } = await axios.get(`${ML_BASE_URL}/health`);
      return data.status === "ok";
    } catch {
      return false;
    }
  }
}
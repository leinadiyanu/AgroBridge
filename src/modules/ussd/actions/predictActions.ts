import type { ActionHandler } from "../actions/types.js";
import { PredictionService } from "../../predictions/service.js";

export const predictionActions: Record<string, ActionHandler> = {
 PREDICT_PRICE: async ({ repo, phoneNumber, value }) => {
  const parts = value.split("|");
  const commodity = parts[0]?.trim();
  const state = parts[1]?.trim() ?? "Lagos";
  if (!commodity) {
    await repo.deleteSession(phoneNumber);
    return "END Invalid input. Please try again.";
  }
  try {
    const r = await new PredictionService().predict({ commodity, state });
    await repo.deleteSession(phoneNumber);
    return (
      `END ${r.commodity} (${r.state}) /${r.unit}\n` +
      `Now: ${r.current_price} Prev: ${r.previous_price}\n` +
      `High: ${r.highest_price_recorded} Low: ${r.lowest_price_recorded}\n` +
      `Trend: ${r.direction}\n${r.advice}`
    );
  } catch {
    await repo.deleteSession(phoneNumber);
    return "END Price prediction unavailable. Try again later.";
  }
},

  BEST_TIME: async ({ repo, phoneNumber, latestInput }) => {
    try {
      const result = await new PredictionService().bestTime(latestInput.trim());
      await repo.deleteSession(phoneNumber);
      return `END Best time to sell ${result.commodity}:\n${result.best_month_to_sell}`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch best time. Try again later.";
    }
  },
};
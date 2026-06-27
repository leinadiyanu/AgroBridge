import type { ActionHandler } from "./types.js";

export const earningsActions: Record<string, ActionHandler> = {
  EARNINGS: async ({ repo, phoneNumber }) => {
    try {
      const earnings = await repo.getEarnings(phoneNumber);
      await repo.deleteSession(phoneNumber);
      return `END Total: NGN ${earnings.total}\nPending: NGN ${earnings.pending}\nPaid Out: NGN ${earnings.paidOut}`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch earnings. Try again.";
    }
  },
};
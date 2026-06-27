import type { ActionHandler } from "../actions/types.js";

export const agentActions: Record<string, ActionHandler> = {
  ADD_FARMER: async ({ repo, phoneNumber, latestInput }) => {
    try {
      const farmer = await repo.findUserByPhone(latestInput);
      if (!farmer || farmer.role !== "FARMER") {
        await repo.deleteSession(phoneNumber);
        return "END No farmer found with that number.";
      }
      await repo.linkFarmerToAgent({ agentPhone: phoneNumber, farmerPhone: latestInput });
      await repo.deleteSession(phoneNumber);
      return `END Farmer ${farmer.name} added successfully.`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Failed to add farmer. Try again.";
    }
  },

  VIEW_FARMERS: async ({ repo, phoneNumber }) => {
    try {
      const farmers = await repo.getFarmersByAgentPhone(phoneNumber);
      await repo.deleteSession(phoneNumber);
      if (!farmers.length) return "END You have no farmers added yet.";
      const lines = farmers.slice(0, 5).map((f: any, i: number) => `${i + 1}. ${f.name} - ${f.location}`).join("\n");
      return `END My Farmers:\n${lines}`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch farmers. Try again.";
    }
  },

  AGENT_REPORTS: async ({ repo, phoneNumber }) => {
    try {
      const r = await repo.getAgentReportSummary(phoneNumber);
      await repo.deleteSession(phoneNumber);
      return `END Agent Report\nFarmers: ${r.farmerCount}\nTransactions: ${r.transactionCount}\nTotal Facilitated: NGN ${r.totalFacilitated}`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Could not fetch report. Try again.";
    }
  },

  FACILITATE_TRANSACTION: async ({ repo, session, phoneNumber, latestInput }) => {
    const pinValid = await repo.verifyPin(phoneNumber, latestInput);
    if (!pinValid) {
      await repo.deleteSession(phoneNumber);
      return "END Incorrect PIN. Transaction cancelled.";
    }
    const { facilitatePhone, facilitateBuyerPhone, facilitateAmount } = session.data;
    if (!facilitatePhone || !facilitateBuyerPhone || !facilitateAmount) {
      await repo.deleteSession(phoneNumber);
      return "END Session data missing. Please try again.";
    }
    try {
      await repo.createTransaction({ agentPhone: phoneNumber, farmerPhone: facilitatePhone, buyerPhone: facilitateBuyerPhone, amount: parseInt(facilitateAmount) });
      await repo.deleteSession(phoneNumber);
      return `END Transaction of NGN ${facilitateAmount} facilitated successfully.`;
    } catch {
      await repo.deleteSession(phoneNumber);
      return "END Transaction failed. Try again.";
    }
  },
};
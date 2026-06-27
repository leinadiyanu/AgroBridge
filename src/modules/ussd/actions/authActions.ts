import type { ActionHandler } from "../actions/types.js";

export const authActions: Record<string, ActionHandler> = {
  CREATE_USER: async ({ repo, session, phoneNumber, latestInput }) => {
    if (session.data.pin !== latestInput) return "CON PINs do not match. Please start again.";
    const { name, location, role, pin } = session.data;
    if (!name || !location || !role || !pin) {
      await repo.deleteSession(phoneNumber);
      return "END Something went wrong. Please try again.";
    }
    await repo.createUser({ phoneNumber, name, location, role: role as any, pin });
    await repo.deleteSession(phoneNumber);
    return "END Registration successful! Welcome to AgroBridge.";
  },
};
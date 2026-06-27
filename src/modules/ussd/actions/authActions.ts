import type { ActionHandler } from "../actions/types.js";

export const authActions: Record<string, ActionHandler> = {
  CREATE_USER: async ({ repo, session, phoneNumber, latestInput }) => {
    if (session.data.pin !== latestInput)
      return "CON PINs do not match. Please start again.";
    const { name, location, role, pin } = session.data;
    if (!name || !location || !role || !pin) {
      await repo.deleteSession(phoneNumber);
      return "END Something went wrong. Please try again.";
    }
    await repo.createUser({
      phoneNumber,
      name,
      location,
      role: role as any,
      pin,
    });
    await repo.deleteSession(phoneNumber);
    return "END Registration successful! Welcome to AgroBridge.";
  },
  VERIFY_LOGIN_PIN: async ({
    repo,
    session,
    phoneNumber,
    latestInput,
    flow,
  }) => {
    const valid = await repo.verifyPin(phoneNumber, latestInput);
    if (!valid) {
      await repo.deleteSession(phoneNumber);
      return "END Incorrect PIN.";
    }
    session.step = "menu";
    await repo.saveSession(phoneNumber, session);
    const menuStep = flow.steps["menu"];
    return typeof menuStep.prompt === "function"
      ? menuStep.prompt(
          session.data.role,
          session.data.name,
          session.data.location,
        )
      : menuStep.prompt;
  },
};

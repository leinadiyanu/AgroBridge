import { UssdRepository } from "../repository.js";
import type { UssdSession } from "../repository.js";

export class FlowEngine {
  constructor(private repo: UssdRepository) {}

  async run(flow: any, steps: string[], phoneNumber: string): Promise<string> {
    // 1. Load existing session from Redis (or start fresh)
    let session: UssdSession = (await this.repo.getSession(phoneNumber)) ?? {
      step: flow.start,
      data: {},
    };

    // 2. The latest input is the LAST item in steps
    const latestInput = steps[steps.length - 1];
    const currentStepKey = session.step;
    const currentStep = flow.steps[currentStepKey];

    // 3. If no input yet, show the first prompt
    if (!latestInput) {
      return currentStep.prompt;
    }

    // 4. Validate
    if (!currentStep.validate(latestInput)) {
      return currentStep.error;
    }

    // 5. Transform and save
    const value = currentStep.transform
      ? currentStep.transform(latestInput)
      : latestInput;

    session.data[currentStepKey] = value;

    // 6. ── Action handlers (must come BEFORE next-step logic) ────

    // ── CREATE_USER ───────────────────────────────────────────────
    if (currentStep.action === "CREATE_USER") {
      if (session.data.pin !== latestInput) {
        return "CON PINs do not match. Please start again.";
      }

      const { name, location, role, pin } = session.data;
      if (!name || !location || !role || !pin) {
        await this.repo.deleteSession(phoneNumber);
        return "END Something went wrong. Please try again.";
      }

      await this.repo.createUser({
        phoneNumber,
        name,
        location,
        role: role as any,
        pin,
      });
      await this.repo.deleteSession(phoneNumber);
      return "END Registration successful! Welcome to AgroBridge.";
    }

    // ── PREDICT_PRICE ─────────────────────────────────────────────
    if (currentStep.action === "PREDICT_PRICE") {
      const cropName = latestInput.trim().toLowerCase();
      try {
        const res = await fetch(
          `${process.env.ML_SERVICE_URL}/predict?crop=${cropName}`
        );
        if (!res.ok) throw new Error("ML service error");
        const { predicted_price, unit } = await res.json();
        await this.repo.deleteSession(phoneNumber);
        return `END Price Prediction for ${latestInput}:\nEst. ${unit}: NGN ${predicted_price}\nBest time to sell: next 2 weeks`;
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not fetch prediction. Try again later.";
      }
    }

    // ── POST_PRODUCE ──────────────────────────────────────────────
    if (currentStep.action === "POST_PRODUCE") {
      const { postCrop, postQuantity, postPrice, postLocation } = session.data;

      if (!postCrop || !postQuantity || !postPrice || !postLocation) {
        await this.repo.deleteSession(phoneNumber);
        return "END Something went wrong. Please try again.";
      }

      const location =
        postLocation === "0"
          ? session.data.profileLocation ?? session.data.location
          : postLocation;

      if (!location) {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not resolve location. Please try again.";
      }

      try {
        await this.repo.createListing({
          phoneNumber,
          crop: postCrop,
          quantity: parseInt(postQuantity),
          price: parseInt(postPrice),
          location,
          availableFrom: latestInput,
        });
        await this.repo.deleteSession(phoneNumber);
        return `END Listing posted!\n${postCrop}, ${postQuantity}kg @ NGN ${postPrice}/kg`;
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Failed to post listing. Try again.";
      }
    }

    // ── BROWSE_PRODUCE ────────────────────────────────────────────
    if (currentStep.action === "BROWSE_PRODUCE") {
      try {
        const listings: any[] = await this.repo.getListingsByCrop(
          latestInput.trim()
        );
        await this.repo.deleteSession(phoneNumber);

        if (!listings.length) {
          return `END No listings found for ${latestInput}.`;
        }

        const lines = listings
          .slice(0, 3)
          .map(
            (l: any) =>
              `${l.crop} ${l.quantity}kg @${l.price}/kg - ${l.location}`
          )
          .join("\n");
        return `END Results:\n${lines}`;
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not fetch listings. Try again.";
      }
    }

    // ── ADD_FARMER ────────────────────────────────────────────────
    if (currentStep.action === "ADD_FARMER") {
      try {
        const farmer = await this.repo.findUserByPhone(latestInput);
        if (!farmer || farmer.role !== "FARMER") {
          await this.repo.deleteSession(phoneNumber);
          return "END No farmer found with that number.";
        }
        await this.repo.linkFarmerToAgent({
          agentPhone: phoneNumber,
          farmerPhone: latestInput,
        });
        await this.repo.deleteSession(phoneNumber);
        return `END Farmer ${farmer.name} added successfully.`;
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Failed to add farmer. Try again.";
      }
    }

    // ── FACILITATE_TRANSACTION ────────────────────────────────────
    if (currentStep.action === "FACILITATE_TRANSACTION") {
      const pinValid = await this.repo.verifyPin(phoneNumber, latestInput);
      if (!pinValid) {
        await this.repo.deleteSession(phoneNumber);
        return "END Incorrect PIN. Transaction cancelled.";
      }

      const { facilitatePhone, facilitateBuyerPhone, facilitateAmount } =
        session.data;

      if (!facilitatePhone || !facilitateBuyerPhone || !facilitateAmount) {
        await this.repo.deleteSession(phoneNumber);
        return "END Session data missing. Please try again.";
      }

      try {
        await this.repo.createTransaction({
          agentPhone: phoneNumber,
          farmerPhone: facilitatePhone,
          buyerPhone: facilitateBuyerPhone,
          amount: parseInt(facilitateAmount),
        });
        await this.repo.deleteSession(phoneNumber);
        return `END Transaction of NGN ${facilitateAmount} facilitated successfully.`;
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Transaction failed. Try again.";
      }
    }

    // 7. ── No action — move to next step ─────────────────────────
    const nextKey =
      typeof currentStep.next === "function"
        ? currentStep.next(latestInput)
        : currentStep.next;

    session.step = nextKey;
    await this.repo.saveSession(phoneNumber, session);

    const nextStep = flow.steps[nextKey];

    if (nextStep.isTerminal) {
      await this.repo.deleteSession(phoneNumber);
    }

    return typeof nextStep.prompt === "function"
      ? nextStep.prompt(session.data.role, session.data.name, session.data.location)
      : nextStep.prompt;
  }
}
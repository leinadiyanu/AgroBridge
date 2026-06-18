import { UssdRepository } from "../repository.js";
import type { UssdSession } from "../repository.js";
import { PredictionService } from "../../predictions/service.js";

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
      const parts = latestInput.split("|");
      const commodity = parts[0]?.trim();
      const state = parts[1]?.trim() ?? "Lagos";

      if (!commodity) {
        await this.repo.deleteSession(phoneNumber);
        return "END Invalid input. Please try again.";
      }
      try {
        const predictionService = new PredictionService();
        const result = await predictionService.predict({
          commodity: commodity.trim(),
          state: state?.trim() ?? "Lagos",
        });
        await this.repo.deleteSession(phoneNumber);
        return (
          `END ${result.commodity} in ${result.state}\n` +
          `Trend: ${result.direction}\n` +
          `${result.advice}`
        );
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Price prediction unavailable. Try again later.";
      }
    }

    // ── BEST_TIME ─────────────────────────────────────────────────
    if (currentStep.action === "BEST_TIME") {
      try {
        const predictionService = new PredictionService();
        const result = await predictionService.bestTime(latestInput.trim());
        await this.repo.deleteSession(phoneNumber);
        return (
          `END Best time to sell ${result.commodity}:\n` +
          `${result.best_month_to_sell}`
        );
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not fetch best time. Try again later.";
      }
    }
    // ── MY_INCOMING_ORDERS ────────────────────────────────────────
    if (currentStep.action === "MY_INCOMING_ORDERS") {
      try {
        const orders = await this.repo.getIncomingOrders(phoneNumber);
        if (!orders.length) {
          await this.repo.deleteSession(phoneNumber);
          return "END You have no incoming orders.";
        }

        const lines = orders
          .slice(0, 3)
          .map(
            (o: any, i: number) =>
              `${i + 1}. ${o.listing.crop} ${o.quantity}kg\n   Buyer: ${o.buyer.name}`,
          )
          .join("\n");
        session.data.orderIds = orders
          .slice(0, 3)
          .map((o: any) => o.id)
          .join(",") as string;

        // session.data.orderIds = orders.slice(0, 3).map((o: any) => o.id);
        session.step = "orderAction";
        await this.repo.saveSession(phoneNumber, session);

        return `CON Incoming Orders:\n${lines}\n\nSelect order number or 0 to go back`;
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not fetch orders. Try again.";
      }
    }

    // ── CONFIRM_ORDER ─────────────────────────────────────────────
    if (currentStep.action === "CONFIRM_ORDER") {
      try {
        const orderId = session.data.selectedOrderId;
        if (!orderId) {
          await this.repo.deleteSession(phoneNumber);
          return "END Session expired. Please try again.";
        }
        await this.repo.updateOrderStatus(orderId, "CONFIRMED");
        await this.repo.deleteSession(phoneNumber);
        return "END Order confirmed successfully.";
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not confirm order. Try again.";
      }
    }

    // ── CANCEL_ORDER ──────────────────────────────────────────────
    if (currentStep.action === "CANCEL_ORDER") {
      try {
        const orderId = session.data.selectedOrderId;
        if (!orderId) {
          await this.repo.deleteSession(phoneNumber);
          return "END Session expired. Please try again.";
        }
        await this.repo.updateOrderStatus(orderId, "CANCELLED");
        await this.repo.deleteSession(phoneNumber);
        return "END Order cancelled.";
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not cancel order. Try again.";
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
          ? (session.data.profileLocation ?? session.data.location)
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

    // ── MY_LISTINGS ───────────────────────────────────────────────
    if (currentStep.action === "MY_LISTINGS") {
      try {
        const listings = await this.repo.getListingsByPhone(phoneNumber);
        if (!listings.length) {
          await this.repo.deleteSession(phoneNumber);
          return "END You have no active listings.";
        }

        const lines = listings
          .slice(0, 3)
          .map(
            (l: any, i: number) =>
              `${i + 1}. ${l.crop} ${l.quantity}kg @${l.price}/kg`,
          )
          .join("\n");

        // Save listing IDs in session for actions
        
        // session.data.listingIds = listings.slice(0, 3).map((l: any) => l.id);
        session.data.listingIds = listings.slice(0, 3).map((l: any) => l.id).join(",") as string;
        session.step = "listingAction";
        await this.repo.saveSession(phoneNumber, session);

        return `CON My Listings:\n${lines}\n\nSelect listing number or 0 to go back`;
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not fetch listings. Try again.";
      }
    }

    // ── MARK_LISTING_SOLD ─────────────────────────────────────────
    if (currentStep.action === "MARK_LISTING_SOLD") {
      try {
        const listingId = session.data.selectedListingId;

        if (!listingId) {
          await this.repo.deleteSession(phoneNumber);
          return "END Session expired. Please try again.";
        }
        await this.repo.updateListingStatus(listingId, "SOLD");
        await this.repo.deleteSession(phoneNumber);
        return "END Listing marked as sold successfully.";
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not update listing. Try again.";
      }
    }

    // ── CANCEL_LISTING ────────────────────────────────────────────
    if (currentStep.action === "CANCEL_LISTING") {
      try {
        const listingId = session.data.selectedListingId;
        if (!listingId) {
          await this.repo.deleteSession(phoneNumber);
          return "END Session expired. Please try again.";
        }
        await this.repo.updateListingStatus(listingId, "CANCELLED");
        await this.repo.deleteSession(phoneNumber);
        return "END Listing cancelled successfully.";
      } catch {
        await this.repo.deleteSession(phoneNumber);
        return "END Could not cancel listing. Try again.";
      }
    }

    // ── BROWSE_PRODUCE ────────────────────────────────────────────
    if (currentStep.action === "BROWSE_PRODUCE") {
      try {
        const listings: any[] = await this.repo.getListingsByCrop(
          latestInput.trim(),
        );
        await this.repo.deleteSession(phoneNumber);

        if (!listings.length) {
          return `END No listings found for ${latestInput}.`;
        }

        const lines = listings
          .slice(0, 3)
          .map(
            (l: any) =>
              `${l.crop} ${l.quantity}kg @${l.price}/kg - ${l.location}`,
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
      ? nextStep.prompt(
          session.data.role,
          session.data.name,
          session.data.location,
        )
      : nextStep.prompt;
  }
}

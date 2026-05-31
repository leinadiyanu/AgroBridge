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
    console.log(await this.repo.getSession(phoneNumber));
    // 2. The latest input is the LAST item in steps
    //    (Africa's Talking sends the full history every time)
    const latestInput = steps[steps.length - 1];

    const currentStepKey = session.step;
    const currentStep = flow.steps[currentStepKey];

    // 3. If no input yet (user just entered the flow), show the first prompt
    if (!latestInput) {
      return currentStep.prompt;
    }

    // 4. Validate the input for the current step
    if (!currentStep.validate(latestInput)) {
      return currentStep.error;
    }

    // 5. Transform the input if needed (e.g. "1" → "FARMER"), then save it
    const value = currentStep.transform
      ? currentStep.transform(latestInput)
      : latestInput;

    session.data[currentStepKey] = value;

    // 6. Check if this step has a final action
    if (currentStep.action === "CREATE_USER") {
      // Confirm PIN check
      if (session.data.pin !== latestInput) {
        return "CON PINs do not match. Please start again.";
      }

      // All data collected — create the user
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

      // Clean up session from Redis
      await this.repo.deleteSession(phoneNumber);

      return "END Registration successful! Welcome to AgroBridge.";
    }

    // 7. Move to the next step and save updated session
    session.step = currentStep.next;
    await this.repo.saveSession(phoneNumber, session);

    // 8. Return the next step's prompt
    const nextStep = flow.steps[currentStep.next];
    return nextStep.prompt;
  }
}

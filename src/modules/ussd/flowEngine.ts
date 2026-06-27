import { UssdRepository } from "./repository.js";
import type { UssdSession } from "./repository.js";
import { authActions } from "./actions/authActions.js";
import { predictionActions } from "./actions/predictActions.js";
import { listingActions } from "./actions/listingActions.js";
import { orderActions } from "./actions/orderActions.js";
import { agentActions } from "./actions/agentActions.js";
import { earningsActions } from "./actions/earningsActions.js";
import type { ActionHandler } from "./actions/types.js";

const actionRegistry: Record<string, ActionHandler> = {
  ...authActions,
  ...predictionActions,
  ...listingActions,
  ...orderActions,
  ...agentActions,
  ...earningsActions,
};

export class FlowEngine {
  constructor(private repo: UssdRepository) {}

  async run(flow: any, steps: string[], phoneNumber: string): Promise<string> {
    let session: UssdSession = (await this.repo.getSession(phoneNumber)) ?? {
      step: flow.start,
      data: {},
    };

    const latestInput = steps[steps.length - 1];
    const currentStepKey = session.step;
    const currentStep = flow.steps[currentStepKey];

    if (!latestInput) {
      return typeof currentStep.prompt === "function"
        ? currentStep.prompt(
            session.data.role,
            session.data.name,
            session.data.location,
          )
        : currentStep.prompt;
    }

    if (currentStep.validate && !currentStep.validate(latestInput)) {
      return currentStep.error;
    }

    const value = currentStep.transform
      ? currentStep.transform(latestInput, session.data)
      : latestInput;
    session.data[currentStepKey] = value;
    if (currentStep.saveAs) session.data[currentStep.saveAs] = value;

    if (currentStep.action) {
      return this.executeAction(
        currentStep.action,
        session,
        phoneNumber,
        latestInput,
        value,
        flow, // ← added
      );
    }

    // const nextKey =
    //   typeof currentStep.next === "function"
    //     ? currentStep.next(latestInput)
    //     : currentStep.next;
    // session.step = nextKey;
    // const nextStep = flow.steps[nextKey];
    const nextKey =
      typeof currentStep.next === "function"
        ? currentStep.next(latestInput)
        : currentStep.next;
    session.step = nextKey;
    const nextStep = flow.steps[nextKey];

    if (nextStep.action && !nextStep.validate) {
      const autoValue = nextStep.transform
        ? nextStep.transform(latestInput, session.data)
        : value;
      if (nextStep.saveAs) session.data[nextStep.saveAs] = autoValue;
      return this.executeAction(
        nextStep.action,
        session,
        phoneNumber,
        latestInput,
        autoValue,
        flow,
      );
    }

    // if (nextStep.action && !nextStep.validate) {
    //   return this.executeAction(
    //     nextStep.action,
    //     session,
    //     phoneNumber,
    //     latestInput,
    //     value,
    //     flow, // ← added
    //   );
    // }

    await this.repo.saveSession(phoneNumber, session);
    if (nextStep.isTerminal) await this.repo.deleteSession(phoneNumber);

    return typeof nextStep.prompt === "function"
      ? nextStep.prompt(
          session.data.role,
          session.data.name,
          session.data.location,
        )
      : nextStep.prompt;
  }

  private async executeAction(
    action: string,
    session: UssdSession,
    phoneNumber: string,
    latestInput: string,
    value: string,
    flow: any, // ← added
  ): Promise<string> {
    const handler = actionRegistry[action];
    if (!handler) {
      await this.repo.deleteSession(phoneNumber);
      return "END Something went wrong. Please try again.";
    }
    return handler({
      repo: this.repo,
      session,
      phoneNumber,
      latestInput,
      value,
      flow, // ← added
    });
  }
}

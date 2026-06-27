import type { UssdRepository, UssdSession } from "../repository.js";

export interface ActionContext {
  repo: UssdRepository;
  session: UssdSession;
  phoneNumber: string;
  latestInput: string;
  value: string;
}

export type ActionHandler = (ctx: ActionContext) => Promise<string>;
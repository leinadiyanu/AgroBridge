import type { UssdRepository, UssdSession } from "../repository.js";

export interface ActionContext {
  repo: UssdRepository;
  session: UssdSession;
  phoneNumber: string;
  latestInput: string;
  value: string;
}

export interface ActionContext {
  repo: UssdRepository;
  session: UssdSession;
  phoneNumber: string;
  latestInput: string;
  value: string;
  flow: any; // new — needed so actions can render a sibling step's prompt
}

export type ActionHandler = (ctx: ActionContext) => Promise<string>;

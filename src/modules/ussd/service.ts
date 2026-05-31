import { FlowEngine } from "./ussdFlow/flowEngine.js";
import { registerFlow } from "./ussdFlow/registerFlow.js";
import { UssdRepository } from "./repository.js";

export class UssdService {
  private repo = new UssdRepository();
  private engine = new FlowEngine(this.repo);

  async processRequest({ phoneNumber, text }: any) {
    const user = await this.repo.findUserByPhone(phoneNumber);

    // User dialled in fresh — show main menu
    if (text === "") {
      return `CON Welcome to AgroBridge!
1. Login
2. Register`;
    }

    // Not registered yet — run registration flow
    if (!user) {
      const steps = text ? text.split("*").filter(Boolean) : [];
      return this.engine.run(registerFlow, steps, phoneNumber);
    }

    return `CON Dashboard`;
  }
}
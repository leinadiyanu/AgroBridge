import { FlowEngine } from "./flowEngine.js";
import { registerFlow } from "./registerFlow.js";
import { UssdRepository } from "./repository.js";
import { dashboardFlowFor } from "./dashboard.js";

export class UssdService {
  private repo = new UssdRepository();
  private engine = new FlowEngine(this.repo);
  async processRequest({ phoneNumber, text }: any) {
    // First dial — show main menu
    if (text === "") {
      return `CON Welcome to AgroBridge!
1. Login
2. Register`;
    }

    const allSteps = text.split("*").filter(Boolean);
    const menuChoice = allSteps[0];
    const flowSteps = allSteps.slice(1);

    // Login path
    if (menuChoice === "1") {
      const user = await this.repo.findUserByPhone(phoneNumber);
      if (!user) {
        return "END You don't have an account. Please dial in and select Register.";
      }

      // Inject profile location into session so postLocation can use it
      // const existingSession = await this.repo.getSession(phoneNumber);
      // if (!existingSession) {
      if (flowSteps.length === 0) {
        await this.repo.saveSession(phoneNumber, {
          step: "loginPin", // was "menu"
          data: { profileLocation: user.location, role: user.role },
        });
      }
      // if (flowSteps.length === 0) {
      //   await this.repo.saveSession(phoneNumber, {
      //     step: "menu",
      //     data: { profileLocation: user.location, role: user.role },
      //   });
      // }

      // }
      const dashboardFlow = dashboardFlowFor(user.role);
      return this.engine.run(dashboardFlow, flowSteps, phoneNumber); // expand this later
    }

    // Register path
    if (menuChoice === "2") {
      const user = await this.repo.findUserByPhone(phoneNumber);
      if (user) {
        return "END You already have an account. Please dial in and select Login.";
      }
      return this.engine.run(registerFlow, flowSteps, phoneNumber);
    }

    return "END Invalid option. Please try again.";
  }
}

import { Role } from "@prisma/client";
import { farmerMenuSteps } from "./steps/farmerSteps.js";
import { listingSteps } from "./steps/listingSteps.js";
import { orderSteps } from "./steps/orderSteps.js";
import { predictionSteps } from "./steps/predictionSteps.js";
import { buyerSteps } from "./steps/buyerSteps.js";
import { agentSteps } from "./steps/agentSteps.js";

export const farmerFlow = { start: "menu", steps: { ...farmerMenuSteps, ...listingSteps, ...orderSteps, ...predictionSteps } };
export const buyerFlow = { start: "menu", steps: { ...buyerSteps } };
export const agentFlow = { start: "menu", steps: { ...agentSteps } };

export const dashboardFlowFor = (role: Role) => {
  const map = { [Role.FARMER]: farmerFlow, [Role.BUYER]: buyerFlow, [Role.AGENT]: agentFlow } as any;
  return map[role];
};
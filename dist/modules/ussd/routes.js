import { Router } from "express";
import { UssdController } from "./controller.js";
const router = Router();
const controller = new UssdController();
/** Controller → Service → Repository → Route
 *
 * USSD entry point
 * Africa's Talking sends all USSD requests to this endpoint
 * Handles session-based navigation using POST requests
 */
router.post("/", controller.handleUssd);
export default router;
//# sourceMappingURL=routes.js.map
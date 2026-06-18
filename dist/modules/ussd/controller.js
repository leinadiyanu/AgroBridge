import { UssdService } from "./service.js";
/**
 * Controller layer for USSD requests
 *
 * Responsibilities:
 * - Receives raw HTTP request from Africa's Talking
 * - Extracts session data (sessionId, phoneNumber, text)
 * - Delegates business logic to USSD service
 * - Returns plain text response required by USSD gateway
 */
export class UssdController {
    constructor() {
        this.ussd_service = new UssdService();
        /**
         * Main USSD handler endpoint
         * Converts HTTP request into USSD service request
         */
        this.handleUssd = async (req, res) => {
            try {
                const { sessionId, phoneNumber, text } = req.body;
                console.log(req.body);
                // Delegate logic to service layer
                const response = await this.ussd_service.processRequest({
                    sessionId,
                    phoneNumber,
                    text,
                });
                // USSD gateways require plain text response (not JSON)
                res.set("Content-Type", "text/plain");
                res.send(response);
            }
            catch (error) {
                console.error("USSD Controller Error:", error);
                //Return END to terminate USSD session gracefully on error
                res.set("Content-Type", "text/plain");
                res.send("END Something went wrong. Please try again later.");
            }
        };
    }
}
;
//# sourceMappingURL=controller.js.map
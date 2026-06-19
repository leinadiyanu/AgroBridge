import type { Request, Response } from "express";
/**
 * Controller layer for USSD requests
 *
 * Responsibilities:
 * - Receives raw HTTP request from Africa's Talking
 * - Extracts session data (sessionId, phoneNumber, text)
 * - Delegates business logic to USSD service
 * - Returns plain text response required by USSD gateway
 */
export declare class UssdController {
    private ussd_service;
    /**
     * Main USSD handler endpoint
     * Converts HTTP request into USSD service request
     */
    handleUssd: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map
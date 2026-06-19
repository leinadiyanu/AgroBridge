import { PaymentService } from "./service.js";
import crypto from "crypto";
export class PaymentController {
    constructor(service) {
        this.service = service;
        this.initiate = async (req, res, next) => {
            try {
                const { orderId } = req.body;
                const result = await this.service.initiatePayment(req.user.id, orderId);
                res
                    .status(200)
                    .json({ success: true, message: "Payment initialized", data: result });
            }
            catch (err) {
                next(err);
            }
        };
        this.verify = async (req, res, next) => {
            try {
                const { reference } = req.params;
                const result = await this.service.verifyPayment(reference);
                res.status(200).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        };
        // Paystack webhook — Paystack calls this automatically
        this.webhook = async (req, res, next) => {
            try {
                const signature = req.headers["x-paystack-signature"];
                if (!signature || typeof signature !== "string") {
                    return res.sendStatus(401);
                }
                const hash = crypto
                    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
                    .update(JSON.stringify(req.body))
                    .digest("hex");
                if (hash !== signature) {
                    return res.sendStatus(401);
                }
                const event = req.body;
                if (event.event === "charge.success") {
                    await this.service.verifyPayment(event.data.reference);
                }
                res.sendStatus(200);
            }
            catch (err) {
                res.sendStatus(200);
                console.error("Webhook error:", err);
            }
        };
    }
}
//# sourceMappingURL=controller.js.map
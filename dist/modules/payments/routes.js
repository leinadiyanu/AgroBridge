import { Router } from "express";
import { PaymentController } from "./controller.js";
import { PaymentService } from "./service.js";
import { PaymentRepository } from "./repository.js";
import { authenticate } from "../../shared/middleware/index.js";
const repo = new PaymentRepository();
const service = new PaymentService(repo);
const controller = new PaymentController(service);
const router = Router();
// Webhook must be public — Paystack calls this directly, no auth header
/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Paystack webhook — automatically called by Paystack on payment events (not for manual testing)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed
 *       401:
 *         description: Invalid signature
 */
router.post("/webhook", controller.webhook);
router.use(authenticate);
/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate payment for a confirmed order (buyer pays via Paystack)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId]
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "a1b2c3d4-uuid"
 *     responses:
 *       200:
 *         description: Payment initialized — returns Paystack authorization URL
 *       400:
 *         description: Order must be confirmed before payment, or email missing
 *       403:
 *         description: You can only pay for your own orders
 *       409:
 *         description: Payment already initiated for this order
 */
router.post("/initiate", controller.initiate);
/**
 * @swagger
 * /payments/verify/{reference}:
 *   get:
 *     summary: Verify a Paystack payment and create escrow hold
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         example: "agb_4f2a9c1e8b3d7f10"
 *     responses:
 *       200:
 *         description: Payment verified, funds held in escrow
 *       400:
 *         description: Payment was not successful
 *       404:
 *         description: Transaction not found
 */
router.get("/verify/:reference", controller.verify);
export default router;
//# sourceMappingURL=routes.js.map
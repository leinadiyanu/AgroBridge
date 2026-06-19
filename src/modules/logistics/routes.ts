import { Router } from "express";
import { LogisticsController } from "./controller.js";
import { LogisticsService } from "./service.js";
import { authenticate } from "../../shared/middleware/index.js";

const service = new LogisticsService();
const controller = new LogisticsController(service);

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /logistics/quote:
 *   get:
 *     summary: Get a delivery quote between two locations
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         example: "Lagos Island, Lagos"
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         example: "Ibadan, Oyo"
 *     responses:
 *       200:
 *         description: Delivery quote returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 distance:
 *                   type: number
 *                   example: 120
 *                   description: Driving distance in kilometres
 *                 fee:
 *                   type: number
 *                   example: 18500
 *                   description: Delivery fee in Naira (₦)
 *       400:
 *         description: Missing or invalid from/to query parameters
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       404:
 *         description: Could not geocode one or both locations
 *       503:
 *         description: Location lookup failed (ORS service unavailable)
 */
router.get("/quote", controller.getQuote);

export default router;

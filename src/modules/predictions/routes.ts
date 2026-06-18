import { Router } from "express";
import { PredictionController } from "./controller.js";
import { PredictionService } from "./service.js";
import { authenticate } from "../../shared/middleware/index.js";

const service = new PredictionService();
const controller = new PredictionController(service);

const router = Router();

// Health check — public, useful for monitoring
/**
 * @swagger
 * /predictions/health:
 *   get:
 *     summary: Check ML service health
 *     tags: [Predictions]
 *     responses:
 *       200:
 *         description: ML service status
 */
router.get("/health", controller.health);

// Protected — must be logged in
router.use(authenticate);
/**
 * @swagger
 * /predictions/predict:
 *   post:
 *     summary: Predict crop price
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [commodity, state]
 *             properties:
 *               commodity:
 *                 type: string
 *                 example: Tomatoes
 *               state:
 *                 type: string
 *                 example: Lagos
 *     responses:
 *       200:
 *         description: Price prediction result
 *       503:
 *         description: ML service unavailable
 */
router.post("/predict", controller.predict);
/**
 * @swagger
 * /predictions/best-time/{commodity}:
 *   get:
 *     summary: Get best month to sell a crop
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commodity
 *         required: true
 *         schema:
 *           type: string
 *         example: Tomatoes
 *     responses:
 *       200:
 *         description: Best time to sell
 */
router.get("/best-time/:commodity", controller.bestTime);

export default router;
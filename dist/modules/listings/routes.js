import { Router } from "express";
import { ListingController } from "./controller.js";
import { ListingService } from "./service.js";
import { ListingRepository } from "./repository.js";
import { authenticate } from "../../shared/middleware/index.js";
const repo = new ListingRepository();
const service = new ListingService(repo);
const controller = new ListingController(service);
const router = Router();
// Public — anyone can browse
/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Browse all active listings
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [PRODUCE, LIVESTOCK, INPUT]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of listings
 */
router.get("/", controller.getAll);
/**
 * @swagger
 * /listings/{id}:
 *   get:
 *     summary: Get a single listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing detail
 *       404:
 *         description: Listing not found
 */
router.get("/:id", controller.getOne);
// Protected — must be logged in
router.use(authenticate);
/**
 * @swagger
 * /listings/me/listings:
 *   get:
 *     summary: Get my listings (farmers only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Farmer's listings
 */
router.get("/me/listings", controller.getMine);
/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Create a listing (farmers only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [crop, category, quantity, unit, price, location, availableFrom]
 *             properties:
 *               crop:
 *                 type: string
 *                 example: Tomatoes
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [PRODUCE, LIVESTOCK, INPUT]
 *               quantity:
 *                 type: number
 *                 example: 500
 *               unit:
 *                 type: string
 *                 example: kg
 *               price:
 *                 type: number
 *                 example: 850
 *               location:
 *                 type: string
 *                 example: Kaduna
 *               availableFrom:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Listing created
 *       403:
 *         description: Only farmers can create listings
 */
router.post("/", controller.create);
/**
 * @swagger
 * /listings/{id}:
 *   patch:
 *     summary: Update a listing (farmer owner only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing updated
 *   delete:
 *     summary: Remove a listing (farmer owner only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing removed
 */
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);
export default router;
//# sourceMappingURL=routes.js.map
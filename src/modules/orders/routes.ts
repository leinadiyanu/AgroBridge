import { Router } from "express";
import { OrderController } from "./controller.js";
import { OrderService } from "./service.js";
import { OrderRepository } from "./repository.js";
import { ListingRepository } from "../listings/repository.js";
import { authenticate } from "../../shared/middleware/index.js";

const orderRepo = new OrderRepository();
const listingRepo = new ListingRepository();
const service = new OrderService(orderRepo, listingRepo);
const controller = new OrderController(service);

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place an order (buyers only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [listingId, quantity]
 *             properties:
 *               listingId:
 *                 type: string
 *                 example: "a1b2c3d4-uuid"
 *               quantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid quantity or listing unavailable
 *       403:
 *         description: Only buyers can place orders
 *       404:
 *         description: Listing not found
 */
router.post("/", controller.place);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get my orders (role-aware — buyer sees placed orders, farmer sees received orders)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Paginated list of orders
 */
router.get("/", controller.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order's detail
 *     tags: [Orders]
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
 *         description: Order detail
 *       403:
 *         description: You do not have access to this order
 *       404:
 *         description: Order not found
 */
router.get("/:id", controller.getOne);

/**
 * @swagger
 * /orders/{id}/confirm:
 *   patch:
 *     summary: Confirm a pending order (farmer only)
 *     tags: [Orders]
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
 *         description: Order confirmed
 *       400:
 *         description: Only pending orders can be confirmed
 *       403:
 *         description: Only farmers can confirm orders
 */
router.patch("/:id/confirm", controller.confirm);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order (buyer or farmer)
 *     tags: [Orders]
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
 *         description: Order cancelled
 *       400:
 *         description: This order cannot be cancelled
 */
router.patch("/:id/cancel", controller.cancel);

/**
 * @swagger
 * /orders/{id}/complete:
 *   patch:
 *     summary: Mark order as completed (buyer confirms delivery, triggers escrow release)
 *     tags: [Orders]
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
 *         description: Order completed, payment released
 *       400:
 *         description: Only confirmed orders can be completed
 *       403:
 *         description: Only buyers can complete orders
 */
router.patch("/:id/complete", controller.complete);

export default router;
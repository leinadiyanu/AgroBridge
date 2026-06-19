import { Router } from "express";
import { UserController } from "./controller.js";
import { authenticate } from "../../shared/middleware/index.js";

const router = Router();
const ctrl = new UserController();

router.use(authenticate);

// ── Own profile ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full profile with role-specific extras (farmer gets assigned agent, agent gets managed farmer count)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/me", ctrl.getMe);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Emeka Obi
 *               location:
 *                 type: string
 *                 example: Kano, Nigeria
 *               email:
 *                 type: string
 *                 example: emeka@example.com
 *               farmSize:
 *                 type: string
 *                 example: 5 hectares
 *                 description: FARMER only
 *               deliveryAddress:
 *                 type: string
 *                 example: 12 Broad Street, Lagos
 *                 description: BUYER only
 *               coverageArea:
 *                 type: string
 *                 example: Lagos Island
 *                 description: AGENT only
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already taken by another account
 */
router.patch("/me", ctrl.updateProfile);

// ── Sensitive changes ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /users/me/password:
 *   patch:
 *     summary: Change password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPass123
 *               newPassword:
 *                 type: string
 *                 example: NewPass456
 *                 description: Min 8 characters, must differ from current password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: New password too short or same as current
 *       401:
 *         description: Old password incorrect
 *       403:
 *         description: No password on account (USSD-only user)
 */
router.patch("/me/password", ctrl.changePassword);

/**
 * @swagger
 * /users/me/phone:
 *   patch:
 *     summary: Initiate phone number change (step 1 of 2)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Sends an OTP via SMS to the new number and stores a pending change in Redis for 10 minutes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPhone]
 *             properties:
 *               newPhone:
 *                 type: string
 *                 example: "+2348099999999"
 *     responses:
 *       200:
 *         description: OTP sent to new phone number
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Phone number already in use
 */
router.patch("/me/phone", ctrl.initiatePhoneChange);

/**
 * @swagger
 * /users/me/phone/verify:
 *   post:
 *     summary: Confirm phone number change (step 2 of 2)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Verifies the OTP and commits the new phone number to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp]
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "482910"
 *                 description: 6-digit code sent to the new number
 *     responses:
 *       200:
 *         description: Phone number updated successfully
 *       400:
 *         description: OTP invalid or expired, or no pending change found (session expired)
 *       401:
 *         description: Unauthorized
 */
router.post("/me/phone/verify", ctrl.verifyPhoneChange);

// ── Lists ─────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /users/farmers:
 *   get:
 *     summary: List all farmers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Results per page (max 50)
 *     responses:
 *       200:
 *         description: Paginated list of farmers with assigned agent info
 *       401:
 *         description: Unauthorized
 */
router.get("/farmers", ctrl.listFarmers);

/**
 * @swagger
 * /users/agents:
 *   get:
 *     summary: List all agents
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Results per page (max 50)
 *     responses:
 *       200:
 *         description: Paginated list of agents with managed farmer count
 *       401:
 *         description: Unauthorized
 */
router.get("/agents", ctrl.listAgents);

// ── Public profile ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get public profile of any user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         description: Target user UUID
 *     responses:
 *       200:
 *         description: Public profile (name, role, location only — phone and email are never returned)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/:id", ctrl.getPublicProfile);

/**
 * @swagger
 * /users/me/farmers:
 *   post:
 *     summary: Add a farmer to managed list (agents only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [farmerPhone]
 *             properties:
 *               farmerPhone:
 *                 type: string
 *                 example: "+2348012345678"
 *     responses:
 *       201:
 *         description: Farmer added successfully
 *       403:
 *         description: Only agents can add farmers
 *       404:
 *         description: No account found with this phone number
 *       409:
 *         description: This farmer is already in your managed list
 *   get:
 *     summary: View my managed farmers (agents only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of managed farmers
 *       403:
 *         description: Only agents have managed farmers
 */
router.post("/me/farmers", ctrl.addFarmer);
router.get("/me/farmers", ctrl.getMyFarmers);

export default router;
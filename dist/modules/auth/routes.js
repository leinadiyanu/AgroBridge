import { Router } from "express";
import { AuthController } from "./controller.js";
import { AppError } from "../../shared/middleware/index.js";
import { verifyAccessToken } from "../../shared/utils/tokenHandler.js";
const router = Router();
const controller = new AuthController();
// ── Auth guard ───────────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next(new AppError("Access token required", 401));
    }
    try {
        const token = authHeader.split(" ")[1];
        if (!token)
            return next(new AppError("Access token required", 401));
        const payload = verifyAccessToken(token);
        req.userId = payload.userId;
        req.role = payload.role;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new AppError("Access token expired", 401));
        }
        return next(new AppError("Invalid access token", 401));
    }
};
// ── Register (2 steps) ───────────────────────────────────────────────────────
/**
 * @swagger
 * /auth/register/initiate:
 *   post:
 *     summary: Start registration — sends OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phoneNumber, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Musa Aliyu
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               email:
 *                 type: string
 *                 example: musa@email.com
 *               password:
 *                 type: string
 *                 example: securepass123
 *               role:
 *                 type: string
 *                 enum: [FARMER, BUYER, AGENT]
 *                 example: FARMER
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       409:
 *         description: Phone number already registered
 */
router.post("/register/initiate", controller.registerInitiate);
/**
 * @swagger
 * /auth/register/verify:
 *   post:
 *     summary: Verify OTP and create account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, phoneOtp]
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               phoneOtp:
 *                 type: string
 *                 example: "123456"
 *               email:
 *                 type: string
 *               emailOtp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account created, tokens returned
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/register/verify", controller.registerVerify);
// ── Login (2 steps) ──────────────────────────────────────────────────────────
/**
 * @swagger
 * /auth/login/initiate:
 *   post:
 *     summary: Login — sends OTP to phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, password]
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 example: securepass123
 *     responses:
 *       200:
 *         description: OTP sent
 *       401:
 *         description: Invalid credentials
 */
router.post("/login/initiate", controller.loginInitiate);
/**
 * @swagger
 * /auth/login/verify:
 *   post:
 *     summary: Verify login OTP and get tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, otp]
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful, tokens returned
 *       401:
 *         description: Invalid or expired OTP
 */
router.post("/login/verify", controller.loginVerify);
// ── Session ──────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New tokens returned
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh", controller.refresh);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout — invalidates refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);
export default router;
router.post("/logout", controller.logout);
//# sourceMappingURL=routes.js.map
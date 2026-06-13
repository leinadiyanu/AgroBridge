import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { AuthController } from "./controller.js";
import { AppError } from "../../shared/middleware/index.js";
import { verifyAccessToken } from "../../shared/utils/tokenHandler.js";

const router = Router();
const controller = new AuthController();

// ── Auth guard ───────────────────────────────────────────────────────────────

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Access token required", 401));
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) return next(new AppError("Access token required", 401));

    const payload = verifyAccessToken(token);
    (req as any).userId = payload.userId;
    (req as any).role = payload.role;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Access token expired", 401));
    }
    return next(new AppError("Invalid access token", 401));
  }
};

// ── Register (2 steps) ───────────────────────────────────────────────────────

router.post("/register/initiate", controller.registerInitiate);
router.post("/register/verify", controller.registerVerify);

// ── Login (2 steps) ──────────────────────────────────────────────────────────

router.post("/login/initiate", controller.loginInitiate);
router.post("/login/verify", controller.loginVerify);

// ── Session ──────────────────────────────────────────────────────────────────

router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);

export default router;

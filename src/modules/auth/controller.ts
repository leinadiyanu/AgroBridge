import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./service.js";

export class AuthController {
  private service = new AuthService();

  // ── Register ──────────────────────────────────────────────────────────────

  registerInitiate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { phoneNumber, email, name, location, role, password } = req.body;
      const result = await this.service.registerInitiate({
        phoneNumber,
        email,
        name,
        location,
        role,
        password,
      });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  registerVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, email, phoneOtp, emailOtp } = req.body;
      const result = await this.service.registerVerify({
        phoneNumber,
        email,
        phoneOtp,
        emailOtp,
      });
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────────

  loginInitiate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, password } = req.body;
      const result = await this.service.loginInitiate({
        phoneNumber,
        password,
      });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  loginVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, otp } = req.body;
      const result = await this.service.loginVerify({ phoneNumber, otp });
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ── Token / Session ───────────────────────────────────────────────────────

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(400)
          .json({ success: false, message: "Refresh token required" });
        return;
      }

      const refreshToken = authHeader.split(" ")[1];
      if (!refreshToken) {
        res
          .status(400)
          .json({ success: false, message: "Refresh token required" });
        return;
      }

      const tokens = await this.service.refresh(refreshToken);
      res
        .status(200)
        .json({ success: true, message: "Tokens refreshed", data: tokens });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(400)
          .json({ success: false, message: "Refresh token required" });
        return;
      };

      const refreshToken = authHeader.split(" ")[1];
      if (!refreshToken) {
        res
          .status(400)
          .json({ success: false, message: "Refresh token required" });
        return;
      };
      
      await this.service.logout(refreshToken);
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.getMe((req as any).userId);
      res.status(200).json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  };
}

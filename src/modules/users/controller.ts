import type { Request, Response, NextFunction } from "express";
import { UserService } from "./service.js";

export class UserController {
  private service = new UserService();

  // ── Own profile ───────────────────────────────────────────────────────────

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.getMe((req as any).userId);
      res.status(200).json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, location, email, farmSize, deliveryAddress, coverageArea } =
        req.body;
      const user = await this.service.updateProfile((req as any).userId, {
        name,
        location,
        email,
        farmSize,
        deliveryAddress,
        coverageArea,
      });
      res
        .status(200)
        .json({ success: true, message: "Profile updated", data: { user } });
    } catch (err) {
      next(err);
    }
  };

  // ── Password ──────────────────────────────────────────────────────────────

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await this.service.changePassword((req as any).userId, {
        oldPassword,
        newPassword,
      });
      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  };

  // ── Phone change ──────────────────────────────────────────────────────────

  initiatePhoneChange = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { newPhone } = req.body;
      const result = await this.service.initiatePhoneChange(
        (req as any).userId,
        newPhone,
      );
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  verifyPhoneChange = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { otp } = req.body;
      const result = await this.service.verifyPhoneChange(
        (req as any).userId,
        otp,
      );
      res.status(200).json({
        success: true,
        message: "Phone number updated successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ── Public profile ────────────────────────────────────────────────────────

  getPublicProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "User ID is required" });
        return;
      }
      const user = await this.service.getPublicProfile(id);
      res.status(200).json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  };

  // ── Lists ─────────────────────────────────────────────────────────────────

  listFarmers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
      const result = await this.service.listFarmers(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  listAgents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
      const result = await this.service.listAgents(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  addFarmer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.addFarmer(
        req.user!.id,
        req.user!.role,
        req.body,
      );
      res
        .status(201)
        .json({
          success: true,
          message: "Farmer added successfully",
          data: result,
        });
    } catch (err) {
      next(err);
    }
  };

  getMyFarmers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const farmers = await this.service.getMyFarmers(
        req.user!.id,
        req.user!.role,
      );
      res.status(200).json({ success: true, data: farmers });
    } catch (err) {
      next(err);
    }
  };
}

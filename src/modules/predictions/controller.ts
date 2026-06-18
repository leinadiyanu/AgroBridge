import type { Request, Response, NextFunction } from "express";
import { PredictionService } from "./service.js";

interface CommodityParam {
  commodity: string;
}

export class PredictionController {
  constructor(private service: PredictionService) {}

  predict = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.predict(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  bestTime = async (
    req: Request<CommodityParam>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.service.bestTime(req.params.commodity);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  health = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const healthy = await this.service.isHealthy();
      res.status(200).json({
        success: true,
        data: { status: healthy ? "ok" : "unavailable" },
      });
    } catch (err) {
      next(err);
    }
  };
}
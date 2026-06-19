import type { Request, Response, NextFunction } from "express";
import { LogisticsService } from "./service.js";

export class LogisticsController {
  constructor(private service: LogisticsService) {}

  getQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { from, to } = req.query;
      const result = await this.service.getDeliveryQuote(
        from as string,
        to as string,
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
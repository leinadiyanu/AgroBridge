import type { Request, Response, NextFunction } from "express";
import { PredictionService } from "./service.js";
interface CommodityParam {
    commodity: string;
}
export declare class PredictionController {
    private service;
    constructor(service: PredictionService);
    predict: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bestTime: (req: Request<CommodityParam>, res: Response, next: NextFunction) => Promise<void>;
    health: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export {};
//# sourceMappingURL=controller.d.ts.map
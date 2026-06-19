import type { Request, Response, NextFunction } from "express";
import { LogisticsService } from "./service.js";
export declare class LogisticsController {
    private service;
    constructor(service: LogisticsService);
    getQuote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map
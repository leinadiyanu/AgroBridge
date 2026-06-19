import type { Request, Response, NextFunction } from "express";
import { PaymentService } from "./service.js";
interface ReferenceParam {
    reference: string;
}
export declare class PaymentController {
    private service;
    constructor(service: PaymentService);
    initiate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verify: (req: Request<ReferenceParam>, res: Response, next: NextFunction) => Promise<void>;
    webhook: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export {};
//# sourceMappingURL=controller.d.ts.map
import type { Request, Response, NextFunction } from "express";
import { OrderService } from "./service.js";
interface IdParam {
    id: string;
}
export declare class OrderController {
    private service;
    constructor(service: OrderService);
    place: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOne: (req: Request<IdParam>, res: Response, next: NextFunction) => Promise<void>;
    confirm: (req: Request<IdParam>, res: Response, next: NextFunction) => Promise<void>;
    cancel: (req: Request<IdParam>, res: Response, next: NextFunction) => Promise<void>;
    complete: (req: Request<IdParam>, res: Response, next: NextFunction) => Promise<void>;
}
export {};
//# sourceMappingURL=controller.d.ts.map
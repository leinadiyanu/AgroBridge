import type { Request, Response, NextFunction } from "express";
import { ListingService } from "./service.js";
interface IdParam {
    id: string;
}
export declare class ListingController {
    private service;
    constructor(service: ListingService);
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOne: (req: Request<IdParam>, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMine: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request<IdParam>, res: Response, next: NextFunction) => Promise<void>;
    remove: (req: Request<IdParam>, res: Response, next: NextFunction) => Promise<void>;
}
export {};
//# sourceMappingURL=controller.d.ts.map
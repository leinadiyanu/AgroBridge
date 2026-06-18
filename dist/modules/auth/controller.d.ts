import type { Request, Response, NextFunction } from "express";
export declare class AuthController {
    private service;
    registerInitiate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    registerVerify: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    loginInitiate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    loginVerify: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    me: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map
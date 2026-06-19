import type { Request, Response, NextFunction } from "express";
export declare class UserController {
    private service;
    getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    changePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    initiatePhoneChange: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyPhoneChange: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPublicProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listFarmers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listAgents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addFarmer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyFarmers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map
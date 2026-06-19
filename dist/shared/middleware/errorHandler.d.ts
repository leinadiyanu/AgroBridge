import type { Request, Response, NextFunction } from "express";
/**
 * Global Error Handling Middleware
 *
 * Catches all errors thrown in the application (synchronous and asynchronous)
 * and sends a consistent response format to the client.
 *
 * Responsibilities:
 * - Centralize error handling across the app
 * - Prevent server crashes from unhandled errors
 * - Format error responses in a consistent structure
 * - Differentiate between operational and unexpected errors
 *
 * Must be registered after all routes.
 */
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map
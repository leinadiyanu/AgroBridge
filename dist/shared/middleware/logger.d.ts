import type { Request, Response, NextFunction } from "express";
/**
 * Request Logging Middleware
 *
 * Logs incoming HTTP requests for monitoring and debugging purposes.
 *
 * Responsibilities:
 * - Track request method, URL, and response time
 * - Help with debugging and performance monitoring
 * - Provide visibility into API usage patterns
 *
 * Runs early in the request lifecycle to capture all incoming traffic.
 */
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=logger.d.ts.map
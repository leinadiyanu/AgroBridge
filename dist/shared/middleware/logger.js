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
export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
};
//# sourceMappingURL=logger.js.map
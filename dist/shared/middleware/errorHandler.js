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
export const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
//# sourceMappingURL=errorHandler.js.map
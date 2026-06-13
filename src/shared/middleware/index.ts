/**
 * Middleware Registry
 *
 * This file exports all middleware functions used across the application.
 * It serves as a central access point for:
 * - Authentication middleware
 * - Error handling middleware
 * - Logging middleware
 *
 * Purpose:
 * - Simplifies imports across the codebase
 * - Keeps middleware organized and centralized
 */

export * from "./logger.js";
export * from "./auth.js";
export * from "./errorHandler.js";
export * from "./appError.js";
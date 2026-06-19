import { PrismaClient } from "@prisma/client";
/**
 * Prisma Database Client Setup
 *
 * This file initializes and exports a singleton instance of PrismaClient
 * to manage database connections efficiently across the application.
 *
 * Key responsibilities:
 * - Creates a single shared PrismaClient instance (prevents multiple connections)
 * - Reuses the same client during development to avoid exhausting database connections
 * - Enables query logging for errors and warnings
 *
 * Development optimization:
 * - Uses a global variable to persist the Prisma instance in development mode
 * - Prevents hot-reload (e.g., Next.js / ts-node-dev) from creating new DB connections on every reload
 *
 * In production:
 * - A fresh PrismaClient instance is created and managed normally
 */
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        log: ["error", "warn"],
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
//# sourceMappingURL=db.js.map
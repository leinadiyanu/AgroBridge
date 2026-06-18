import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AgroBridge API",
            version: "1.0.0",
            description: "Backend API for AgroBridge — connecting farmers, buyers and agents across Nigeria",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        path.join(__dirname, "../modules/auth/routes.ts"),
        path.join(__dirname, "../modules/listings/routes.ts"),
        path.join(__dirname, "../modules/predictions/routes.ts"),
        path.join(__dirname, "../modules/users/routes.ts"),
        // add more routes here as you build them
    ],
};
export const swaggerSpec = swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map
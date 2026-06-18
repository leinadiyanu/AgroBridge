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
    url: process.env.NODE_ENV === "production"
      ? "https://your-app-name.onrender.com"
      : "http://localhost:5000",
    description: process.env.NODE_ENV === "production" ? "Production" : "Local development",
  },
],
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
    path.join(__dirname, "../modules/auth/routes.js"),
    path.join(__dirname, "../modules/listings/routes.js"),
    path.join(__dirname, "../modules/predictions/routes.js"),
    path.join(__dirname, "../modules/users/routes.js"),
    // add more routes here as you build them
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

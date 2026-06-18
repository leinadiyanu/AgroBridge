import express from 'express';
import {requestLogger, errorHandler, } from "./shared/middleware/index.js";
import ussdRoutes from "./modules/ussd/routes.js";
import authRoutes from "./modules/auth/routes.js";
import usersRoutes from "./modules/users/routes.js";
import listingRoutes from "./modules/listings/routes.js";
import predictionRoutes from "./modules/predictions/routes.js";
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import redisClient from './config/redis.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET ?? 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'AgroBridge API is running',
    status: 'OK',
   });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/ussd', ussdRoutes);
app.use("/listings", listingRoutes);
app.use("/predictions", predictionRoutes);

app.use(errorHandler);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;

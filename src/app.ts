import express from 'express';
import {requestLogger, errorHandler, } from "./shared/middleware/index.js";
import ussdRoutes from "./modules/ussd/ussd.routes.js";
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import redisClient from './config/redis.js';


// import { authRoutes } from './modules/auth/auth.routes.js';
// import { usersRoutes } from './modules/users/users.routes.js';

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

// app.use('/auth', authRoutes());
// app.use('/users', usersRoutes());
app.use('/ussd', ussdRoutes);

app.use(errorHandler);
export default app;

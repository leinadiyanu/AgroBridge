import express from 'express';
import {requestLogger, errorHandler, } from "./shared/middleware/index.js";
import ussdRoutes from "./modules/ussd/ussd.routes.js";

// import { authRoutes } from './modules/auth/auth.routes.js';
// import { usersRoutes } from './modules/users/users.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

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

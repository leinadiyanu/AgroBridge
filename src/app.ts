import express from 'express';
import {requestLogger, errorHandler, } from "./shared/middleware/index.js";


// import config from './config/index.js';
// import { authRoutes } from './modules/auth/auth.routes.js';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({ message: 'AgroBridge API is running',
    status: 'OK',
   });
});

app.use(errorHandler);
// app.use('/auth', authRoutes());
export default app;

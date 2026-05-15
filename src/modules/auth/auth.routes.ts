import { Router } from 'express';
import { AuthController } from './controller';

export function authRoutes() {
  const router = Router();
  const controller = new AuthController(null as any);

  router.post('/register', (req, res) => controller.register(req, res));
  router.post('/login', (req, res) => controller.login(req, res));

  return router;
}

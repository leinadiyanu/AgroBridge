import { Router } from 'express';
import { MarketController } from './controller';

export function marketRoutes() {
  const router = Router();
  const controller = new MarketController(null as any);

  router.post('/listing', (req, res) => controller.createListing(req, res));
  router.get('/listing/:id', (req, res) => controller.getListing(req, res));

  return router;
}

import { Router } from 'express';
import { z } from 'zod';
import { recordNavigationEvent } from '../services/analyticsService.js';

const router = Router();

const navigationSchema = z.object({
  path: z.string(),
  referrer: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

router.post('/navigation', async (req, res, next) => {
  try {
    const payload = navigationSchema.parse(req.body);
    const event = await recordNavigationEvent({
      userId: req.user?.sub,
      ...payload,
    });
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

export default router;

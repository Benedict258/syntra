import { Router } from 'express';
import { z } from 'zod';
import { exchangeSupabaseSession, verifyToken, getUserFromSupabase } from '../services/authService.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const { token, user } = await exchangeSupabaseSession(credentials);
    res.json({ token, user });
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true });
});

router.get('/me', async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const decoded = await verifyToken(token);

    let userProfile = decoded;
    if (process.env.SUPABASE_ANON_KEY) {
      const supabaseUser = await getUserFromSupabase(token).catch(() => null);
      if (supabaseUser) {
        userProfile = {
          ...userProfile,
          metadata: supabaseUser.user_metadata,
        };
      }
    }

    res.json({ user: userProfile });
  } catch (error) {
    error.status = 401;
    next(error);
  }
});

export default router;

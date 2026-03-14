import jwt from 'jsonwebtoken';
import { createSupabaseClient } from './supabaseClient.js';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'syntra-dev-secret';

export const signSession = (payload, options = {}) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', ...options });
};

export const verifyToken = async (token) => {
  if (!token) {
    throw new Error('Missing token');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    logger.warn('JWT verification failed', err);
    throw new Error('Invalid token');
  }
};

export const exchangeSupabaseSession = async ({ email, password }) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  const { user, session } = data;
  const tokenPayload = {
    sub: user.id,
    email: user.email,
    roles: user.user_metadata?.roles || [],
  };
  const token = signSession(tokenPayload);
  return { token, user, supabaseToken: session?.access_token };
};

export const getUserFromSupabase = async (token) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    throw error;
  }
  return data.user;
};

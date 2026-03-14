import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    detail: err.details || err.data || null,
  });
};

import { createServer } from 'http';
import app from './app.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 4000;

const server = createServer(app);

server.listen(PORT, () => {
  logger.info(`Syntra API listening on port ${PORT}`);
});

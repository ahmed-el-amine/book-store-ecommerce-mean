import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
import express from 'express';
import connectToDB from './database/connect';
import logger from './lib/winston/index.js';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import routesHandler from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import seedSuperAdmin from './database/seeders/seedSuperAdmin';
import limiter from './middleware/rateLimiter.middleware.js';

// Placed first to caught any uncaught exception in the program
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

app.use(cors({ origin: ['http://localhost:3001'], credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));

app.use(limiter);
app.use('/api/v1', routesHandler);

app.use(errorHandler);

(async function () {
  if (process.env.CREATE_SUPER_ADMIN === 'true') {
    try {
      await seedSuperAdmin(process.env.SUPERADMIN_EMAIL, process.env.SUPERADMIN_USERNAME, process.env.SUPERADMIN_PASSWORD);
    } catch (error) {
      logger.error('Failed to create super Admin please try again', error);
    }
  }
})();

const server = app.listen(port, host, () => {
  logger.info(`[ ready ] http://${host}:${port}`);
});

connectToDB();

// Placed at the bottom to handle any promise rejection in our app
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
import express from 'express';
import connectToDB from './database/connect';
import logger from './lib/winston/index.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import routesHandler from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import seedSuperAdmin from './database/seeders/seedSuperAdmin';
import limiter from './middleware/rateLimiter.middleware.js';
import { v2 as cloudinary } from 'cloudinary';
import socketIOSetup from './socket/socketIOSetup.js';
import { createClient } from 'redis';
import { redisMiddleware } from './middleware/redis.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Placed first to caught any uncaught exception in the program
process.on('uncaughtException', (err) => {
  console.log(err);

  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

redisClient.on('error', (err) => {
  logger.error('Redis Client Error: ', err);
});

const app = express();

redisClient
  .connect()
  .then(() => {
    logger.info('Redis connected successfully');
    app.set('redisClient', redisClient);
  })
  .catch((err) => {
    logger.error('Redis connection failed: ', err);
  });

app.set('trust proxy', true);
app.use(helmet());

const allowOrigins = (process.env.CORS_DOMAINS || '').split(',');

app.use(cors({ origin: allowOrigins, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));

app.use(redisMiddleware);

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
   socketIOSetup(server);
});

// test notification
// import { sendNotificationToUser } from './services/socket.service.js';
// import { notificationType } from './database/models/notification.model';
// import { create } from './services/notifications.service.js';

// setTimeout(async () => {
//   // sendNotificationToAll({
//   //   message: 'Hello from the server',
//   //   type: 'info',
//   //   duration: 5000,
//   // });
//   const notification = await create({
//     title: 'Hello',
//     message: 'Hello from the server',
//     type: notificationType.ERROR,
//     userId: '67c32a551422a435b175f20b',
//   });
//   sendNotificationToUser(notification);
// }, 10000);

connectToDB();

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

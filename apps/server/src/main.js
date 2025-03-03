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

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));

app.use('/api/v1', routesHandler);

connectToDB()
  .then(() => {
    app.listen(port, host, () => {
      logger.info(`[ ready ] http://${host}:${port}`);
    });
  })
  .catch((e) => {
    logger.error(`could not connect to database ${e}`);
  });

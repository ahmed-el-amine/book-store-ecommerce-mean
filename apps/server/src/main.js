import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
import express from 'express';
import connectToDB from './database/connect';
import logger from './lib/winston/index.js';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

connectToDB()
  .then(() => {
    app.listen(port, host, () => {
      logger.info(`[ ready ] http://${host}:${port}`);
    });
  })
  .catch((e) => {
    logger.error(`could not connect to database ${e}`);
  });

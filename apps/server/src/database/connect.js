import mongoose from 'mongoose';
import { importDataOfAuthors } from './models/author.model.js';
import logger from '../lib/winston/index.js';

const connectToDB = () =>
  new Promise((resolve, reject) => {

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');

    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        logger.info('Connected to database successfully');
        // return importDataOfAuthors();
      })
      .then(() => {
        // logger.info('Author data imported successfully');
        return resolve(true);
      })
      .catch((error) => reject(error));
  });

export default connectToDB;
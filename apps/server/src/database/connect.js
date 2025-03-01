import mongoose from 'mongoose';

const connectToDB = () =>
  new Promise((resolve, reject) => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');

    mongoose
      .connect(MONGODB_URI)
      .then(() => resolve(true))
      .catch((error) => reject(error));
  });

export default connectToDB;

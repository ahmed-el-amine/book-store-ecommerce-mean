import mongoose from 'mongoose';
import User from '../models/user.model.js';
import logger from '../../lib/winston/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedSuperAdmin(superEmail, superUserName, superPassword) {
  try {
    //check that Database connected and connect to it
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      logger.info('Database connection established for seeding');
    }

    const checkForSuperAdmin = await User.findOne({ email: superEmail });

    if (checkForSuperAdmin) {
      logger.error(`Super admin with email ${superEmail} already exists`);
      return;
    }



    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      username: superUserName,
      emailData:{
        emailAddress:superEmail,
        isEmailVerified: true,
      },
      password: superPassword,
      phone: '05151515105',
      role: 'superAdmin',
    });

    await superAdmin.save();

    logger.info('super admin created successfully');
  } catch (error) {
    logger.error('Error seeding super admin',error);
  }

}

export default seedSuperAdmin;

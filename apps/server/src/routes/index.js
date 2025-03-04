import express from 'express';
import authRouter from './auth.router.js';
import userRouter from './user.router.js';
import bookRouter from './book.router.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/books',bookRouter);

export default router;

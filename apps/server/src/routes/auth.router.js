import express from 'express';
import useZod from '../middleware/useZod';
import { createUserSchema, loginUserSchema } from '../lib/zod/user.zod';
import { create, login } from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', useZod(createUserSchema), create);

router.post('/login', useZod(loginUserSchema), login);

export default router;

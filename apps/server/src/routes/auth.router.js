import express from 'express';
import useZod from '../middleware/useZod';
import { createUserSchema, loginUserSchema } from '../lib/zod/user.zod';
import { create, login } from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', useZod(createUserSchema), create);

router.post('/login', useZod(loginUserSchema), login);

router.post('/logout', (req, res) => {
  // on logout just remove the cookie from the client
  res.cookie(process.env.JWT_Cookie_Name, '', {
    maxAge: 0,
    expires: new Date(0),
  });
  res.end();
});

export default router;

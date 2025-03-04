import express from 'express';
import useZod from '../middleware/useZod';
import { createUserSchema, loginUserSchema } from '../lib/zod/user.zod';
import { create, login } from '../controllers/user.controller';
import csurf from 'csurf'

const router = express.Router();

 const csrfProtection = csurf({
  cookie:{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict'
  }
});

router.get('/csrf-token',csrfProtection,(req,res)=>{
  return res.json({csrfToken:req.csrfToken()});
});

//Add csrf in production

router.post('/signup',useZod(createUserSchema), async(req,res,next)=>{
  req.isAdminCreation = false;
  next();
},create);

router.post('/login',useZod(loginUserSchema), login);

router.post('/addAdmin',useZod(createUserSchema),async(req,res,next)=>{
  req.isAdminCreation = true;
  next();
},create);

export default router;

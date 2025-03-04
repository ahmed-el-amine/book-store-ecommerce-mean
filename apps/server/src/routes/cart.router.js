import express from 'express';
import {
  addToCart,
  updateCart,
  getCart,
  removeFromCart,
} from '../controllers/cart.controller.js';
import useZod from '../middleware/useZod.js';
import { addToCartSchema } from '../lib/zod/cart.zod.js';

const router = express.Router();

router.post('/', useZod(addToCartSchema), addToCart);
router.delete('/:id', removeFromCart);
router.get('/:userId', getCart);
router.put('/:id', useZod(addToCartSchema), updateCart);

export default router;

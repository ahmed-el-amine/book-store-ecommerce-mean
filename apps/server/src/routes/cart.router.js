import express from 'express';
import { addToCart, updateCart, getCart, removeFromCart } from '../controllers/cart.controller.js';
import useZod from '../middleware/useZod.js';
import { addToCartSchema, removeFromCartSchema, updateCartSchema } from '../lib/zod/cart.zod.js';

const router = express.Router();

router.post('/', useZod(addToCartSchema), addToCart);
router.delete('/', useZod(removeFromCartSchema), removeFromCart);
router.get('/:userId', getCart);
router.put('/', useZod(updateCartSchema), updateCart);

export default router;

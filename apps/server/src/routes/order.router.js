import express from "express";
import { placeOrder, getOrders } from "../controllers/order.controller.js";
import authorization from '../middleware/useAuth.middleware.js';

const router = express.Router();

router.post('/', authorization(['user', 'admin']), placeOrder);
router.get('/', authorization(['user', 'admin']), getOrders);

export default router;

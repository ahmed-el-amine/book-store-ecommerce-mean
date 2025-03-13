import express from "express";
import { placeOrder, getOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post('/place-order', placeOrder);
router.get('/view-order-history', getOrders);

export default router;

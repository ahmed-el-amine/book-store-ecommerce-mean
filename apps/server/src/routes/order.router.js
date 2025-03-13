import express from "express";
import { placeOrder, viewOrderHistory } from "../controllers/order.controller.js";

const router = express.Router();

router.post('/place-order', placeOrder);
router.get('/view-order-history', viewOrderHistory);

export default router;

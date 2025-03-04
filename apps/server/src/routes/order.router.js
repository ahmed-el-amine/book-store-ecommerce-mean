import express from "express";
import { getOrders, addNewOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post('/place-order', async (req, res, next) => {
    try {
        const order = await addNewOrder(req);
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
});

router.get('/view-order-history', async (req, res, next) => {
    try {
        const orders = await getOrders(req);
        res.json(...orders);
    } catch (err) {
        next(err);
    }
});

export default router;

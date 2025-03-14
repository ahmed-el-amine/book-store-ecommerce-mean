import express from 'express';
import { placeOrder, getOrders } from '../controllers/order.controller.js';
import authorization from '../middleware/useAuth.middleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         bookId:
 *           type: strings
 *           description: ID of the book
 *         title:
 *           type: string
 *           description: Title of the book
 *         price:
 *           type: number
 *           description: Price of the book at time of order
 *         quantity:
 *           type: integer
 *           description: Quantity ordered
 *         coverImage:
 *           type: string
 *           format: uri
 *           description: Book cover image URL
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *           description: ID of the user who placed the order
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *         shippingAddress:
 *           $ref: '#/components/schemas/Address'
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           description: Current status of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place an order
 *     description: Create a new order from items in the user's cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: string
 *                 description: ID of the shipping address to use
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input or empty cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.post('/', authorization(['user', 'admin']), placeOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user orders
 *     description: Retrieve all orders for the current user or all orders for admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter orders by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of orders per page
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authorization(['user', 'admin']), getOrders);

export default router;

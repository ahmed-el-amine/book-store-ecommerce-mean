import express from 'express';
import { addToCart, updateCart, getCart, removeFromCart } from '../controllers/cart.controller.js';
import useZod from '../middleware/useZod.js';
import { addToCartSchema, removeFromCartSchema, updateCartSchema } from '../lib/zod/cart.zod.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - bookId
 *         - quantity
 *       properties:
 *         bookId:
 *           type: string
 *           description: ID of the book
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the book
 *     Cart:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalPrice:
 *           type: number
 */

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     description: Add a book to the user's shopping cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input or book not available
 *       401:
 *         description: Unauthorized
 */
router.post('/', useZod(addToCartSchema), addToCart);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a book from the user's shopping cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in cart
 */
router.delete('/', useZod(removeFromCartSchema), removeFromCart);

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieve the current user's shopping cart
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.get('/:userId', getCart);

/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Update cart
 *     description: Update the quantity of an item in the cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in cart
 */
router.put('/', useZod(updateCartSchema), updateCart);

export default router;

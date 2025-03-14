import express from 'express';
import useZod from '../middleware/useZod.js';
import { reviewSchema, patchReviewSchema } from '../lib/zod/review.zod.js';
import { getByBookId, create, deleteReview, updateReview } from '../controllers/review.controller.js';
import useAuth from '../middleware/useAuth.middleware.js';
import { userRoles } from '../database/models/user.model.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - rating
 *         - bookId
 *       properties:
 *         _id:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         comment:
 *           type: string
 *           description: Review comment text
 *         bookId:
 *           type: string
 *           description: ID of the book being reviewed
 *         userId:
 *           type: string
 *           description: ID of the user who wrote the review
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
 * /reviews/{id}:
 *   get:
 *     summary: Get reviews for a book
 *     description: Returns all reviews for a specific book
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', useAuth([userRoles.admin, userRoles.user]), async (req, res) => {
  const reviews = await getByBookId(req.params.id);
  res.json({ reviewList: reviews }, 200);
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review
 *     description: Add a new review for a book
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - bookId
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               bookId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 */
router.post('/', useAuth([userRoles.admin, userRoles.user]), useZod(reviewSchema), async (req, res) => {
  const review = await create(req, res);
  res.json({ message: 'Review created successfully', review }, 201);
});

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update review
 *     description: Update an existing review
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.patch('/:id', useAuth([userRoles.admin, userRoles.user]), useZod(patchReviewSchema), async (req, res, next) => {
  const updatedReview = await updateReview(req, res, next);
  res.json(updatedReview);
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     description: Delete an existing review
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedReview:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.delete('/:id', useAuth([userRoles.admin, userRoles.user]), async (req, res, next) => {
  const deletedReview = await deleteReview(req, res, next);
  return res.status(200).json({ message: 'Review deleted successfully', deletedReview });
});

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get user ID
 *     description: Returns the current authenticated user's ID
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', useAuth([userRoles.admin, userRoles.user]), async (req, res) => {
  const id = req.user.id;
  res.send({ id });
});

export default router;

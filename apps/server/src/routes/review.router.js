import express from 'express';
import useZod from '../middleware/useZod.js';
import { createReviewSchema } from '../lib/zod/review.zod.js';
import { getByBookId, create, deleteReview, updateReview } from '../controllers/review.controller.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const reviewList = await getByBookId(req.params.id);
    res.json({ reviewList: reviewList }, 200)

})

router.post('/', useZod(createReviewSchema), async (req, res) => {
    const review = await create(req.body);
    res.json({ message: 'Employee created successfully', review }, 201);
})

router.patch('/:id', useZod(createReviewSchema), async (req, res, next) => {
    const updatedReview = await updateReview(req, res, next);
    res.json({ updatedReview: updatedReview }, 200)
})

router.delete('/:id', async (req, res, next) => {
    const deletedReview = await deleteReview(req, res, next);
    return res.status(200).json({ message: 'Review deleted successfully', deletedReview });
})

export default router;

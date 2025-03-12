import express from 'express';
import useZod from '../middleware/useZod.js';
import { reviewSchema,patchReviewSchema } from '../lib/zod/review.zod.js';
import { getByBookId, create, deleteReview, updateReview } from '../controllers/review.controller.js';
import useAuth from '../middleware/useAuth.middleware.js';
import { userRoles } from '../database/models/user.model.js';


const router = express.Router();

router.get('/:id', useAuth([userRoles.admin, userRoles.user]),async (req, res) => {
    const reviews = await getByBookId(req.params.id);
    res.json({ reviewList: reviews }, 200)

})

router.post('/', useAuth([userRoles.admin, userRoles.user]), useZod(reviewSchema),async (req, res) => {
    const review = await create(req,res);
    res.json({ message: 'Review created successfully', review }, 201);
})

router.patch('/:id', useAuth([userRoles.admin, userRoles.user]), useZod(patchReviewSchema), async (req, res, next) => {
    const updatedReview = await updateReview(req, res, next);
    res.json(updatedReview);
})

router.delete('/:id', useAuth([userRoles.admin, userRoles.user]),async (req, res, next) => {
    const deletedReview = await deleteReview(req, res, next);
    return res.status(200).json({ message: 'Review deleted successfully', deletedReview });
})

router.get('/', useAuth([userRoles.admin, userRoles.user]), async (req, res) => {
    const id = req.user.id;
    res.send({id})
})

export default router;

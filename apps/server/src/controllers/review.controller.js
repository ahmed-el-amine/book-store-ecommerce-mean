import Review from '../database/models/reviews.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';
import Books from '../database/models/book.model.js';

export const getByBookId = async (id) => {
    const reviews = await Review.find({ bookId: id })
        .populate('reviewOwnerData')
        .exec();
    if (!reviews) {
        throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }
    return reviews;
};

export const create = async (req) => {

    const { comment, rating, bookId } = req.body;
    const userId = req.user.id;
    const book = await Books.findById(bookId).exec();
    if (!book) {
        throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
    }
    const review = await Review.create({
        reviewOwnerData: userId,
        bookId: bookId,
        comment: comment,
        rating: rating
    });
    const reviewData = await Review.findById(review._id).populate('reviewOwnerData').exec();
    return reviewData;
};

export const deleteReview = async (req, res) => {
    const deletedReview = await Review.findById(req.params.id).exec();

    if (!deletedReview) {
        throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }
    if (deletedReview.reviewOwnerData.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    return deletedReview;
};
export const updateReview = async (req, res) => {
    const review = await Review.findById(req.params.id).exec();

    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }
    if (review.reviewOwnerData.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to update this review' });
    }
    const { reviewOwnerData, bookId, ...updatedData } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, updatedData, { new: true }).populate('reviewOwnerData')
        .exec();;
    return updatedReview;
};

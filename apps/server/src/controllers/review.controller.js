import Review from '../database/models/reviews.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';

export const getByBookId = async (id) => {
  const reviews = await Review.find({ bookIdid: id }).exec();
  if (!reviews) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  return reviews;
};

export const create = async (data) => {
  const review = await Review.create(data);

  return review;
};

export const deleteReview = async (req, res, next) => {
  const deletedReview = await Review.findById(req.params.id).exec();

  if (!deletedReview) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (deletedReview.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: 'You are not authorized to delete this review' });
  }
  await deletedReview.delete();
  return deletedReview;
};
export const updateReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id).exec();

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (review.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: 'You are not authorized to update this review' });
  }
  const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return updatedReview;
};

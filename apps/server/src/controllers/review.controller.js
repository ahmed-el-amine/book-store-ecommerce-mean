import Review from '../database/models/reviews.model.js'
import AppError from '../middleware/errorHandler/index.js';


export const getById = async (id, next) => {
    const reviews = await Review
        .find({ _id: id })
        .exec();
    if (!reviews) {
        const err = new AppError('Review not found');
        next(err)
    }
    return reviews;

};

export const create = async (data) => {

    const review = await Review.create(data);

    return review;
};

export const deleteReview = async (id, next) => {
    const deletedReview = await Review.findByIdAndDelete(id).exec();

    if (!deletedReview) {
        const err = new AppError('Review not found');
        next(err)
    }
    return deletedReview;
};

export const updateReview = async (id, data, next) => {
    const review = await Review
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
    if (!review) {
        const err = new AppError('Review not found');
        next(err)
    }
    return review;
}
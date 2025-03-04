import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'you must insert user id'],
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'you must insert book id'],
    },
    rating: {
        type: Number,
        required: [true, 'rating is required'],
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5'],
    },

    comment: {
        type: String,
        required: true,
        minLength: [30, 'comment must be at least 30 charachters'],
        maxLength: [500, 'comment cannot exceed 300 characters'],
        trim: true,
        validate: {
            validator: function (value) {
                return value.trim().length > 0;
            },
            message: 'Comment cannot be just spaces'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


reviewSchema.set('toJSON', {
    transform: (doc, ret) => {
        return {
            id: ret._id,
            rating: ret.rating,
            comment: ret.comment,
            createdAt: ret.createdAt,
            userId: ret.userId,
            bookId: ret.bookId,
        };
    },
});

reviewSchema.index({ userId: 1, bookId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;

import mongoose from 'mongoose';
import authorModel from '../models/author.model.js';
import AppError from '../../utils/customError.js';

const BookModel = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [5, 'Book title must be 5 character at least'],
      required: true,
    },
    isbn13: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 13;
        },
        message: 'ISBN-13 must be 13 characters',
      },
    },
    description: {
      type: String,
      required: true,
      minLength: [15, 'Book description must be 15 character at least'],
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    publish_date: {
      type: Date,
      required: true,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    coverPublicId: {
      type: String,
    },coverImage:{
      type: String,
      required:true
    }
    ,
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: {
        type: String,
        required: true,
      },
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        default: 'g',
      },
    },
    authors: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: 'Author',
    },
    categories: {
      type: [String],
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

//Add DTOS like spring to validate data and make the data consistence
BookModel.methods.toEssentials = function () {
  return {
    _id: this._id,
    title: this.title,
    price: this.price,
    rating: this.rating,
    coverImage: this.coverImage,
    authors: this.authors,
    categories: this.categories,
  };
};

BookModel.methods.toDetails = function () {
  return {
    _id: this._id,
    title: this.title,
    isbn13: this.isbn13,
    description: this.description,
    price: this.price,
    rating: this.rating,
    publish_date: this.publish_date,
    stock: this.stock,
    coverImage: this.coverImage,
    dimensions: this.dimensions,
    weight: this.weight,
    authors: this.authors,
    categories: this.categories,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

//Use methods to use it in queries
BookModel.statics.findEssentials = function () {
  return this.find({}, 'title price rating coverImage authors categories');
};

//check for the id of the authors before save the book to the db

BookModel.pre('save', async function (next) {
  for (const authorId of this.authors) {
    const exists = await authorModel.findById(authorId).exec();
    if (!exists) throw new AppError(404, `Author with ID ${authorId} not found,please insert author first`);
  }
  next();
});

const Books = mongoose.model('Books', BookModel);

export default Books;

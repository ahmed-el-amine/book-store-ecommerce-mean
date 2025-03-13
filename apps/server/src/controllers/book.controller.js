import BookModel from '../database/models/book.model.js';
import AppError from '../utils/customError.js';
import { uploadBookCover, deleteBookCover } from '../utils/cloudinary.js';

const getBooks = async (req, res, next) => {
  try {
    const { categories, price, rating, title, page = 1, limit = 10, sort } = req.query;
    const filter = {};

    if (categories) {
      filter.categories = { $in: [categories] };
    }
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (price) {
      filter.price = { $gte: price };
    }
    if (rating) {
      filter.rating = { $gte: rating };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'authors',
      select: 'title isbn13 description price rating publish_date stock coverImage',
    };

    if (sort) {
      options.sort = sort;
    }

    const result = await BookModel.paginate(filter, options);
    res.json({
      books: result.docs,
      pagination: {
        totalBooks: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      },
    });
  } catch (err) {
    next(new AppError(500, 'Failed to retrieve books'));
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id).populate('authors').exec();
    if (!book) {
      return next(new AppError(404, 'Book not found'));
    }
    res.json(book.toDetails());
  } catch (err) {
    next(new AppError(500, 'Failed to retrieve book'));
  }
};

const addBook = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError(400, 'No file uploaded'));
    }

    const { coverPublicId, coverPublicUrl } = await uploadBookCover(req.file.buffer, req.file.mimetype);

    const bookData = {
      ...req.body,
      coverImage: coverPublicUrl,
      coverPublicId,
    };

    const book = await BookModel.create(bookData);
    res.status(201).json(book);
  } catch (err) {
    if (bookData?.coverPublicId) {
      await deleteBookCover(bookData.coverPublicId);
    }
    next(new AppError(500, 'Failed to add book'));
  }
};

const updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const existingBook = await BookModel.findById(bookId);

    if (!existingBook) {
      return next(new AppError(404, 'Book not found'));
    }

    const updateData = { ...req.body };
    const oldPublicId = existingBook.coverPublicId;

    if (req.file) {
      const { coverPublicUrl, coverPublicId } = await uploadBookCover(req.file.buffer, req.file.mimetype);
      updateData.coverImage = coverPublicUrl;
      updateData.coverPublicId = coverPublicId;
    }

    const updatedBook = await BookModel.findByIdAndUpdate(bookId, updateData, { new: true, runValidators: true });

    if (!updatedBook) {
      if (updateData.coverPublicId) {
        await deleteBookCover(updateData.coverPublicId);
      }
      return next(new AppError(404, 'Book update failed'));
    }

    if (req.file && oldPublicId) {
      await deleteBookCover(oldPublicId);
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    if (updateData?.coverPublicId) {
      await deleteBookCover(updateData.coverPublicId);
    }
    next(new AppError(500, 'Failed to update book'));
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id);

    if (!book) {
      return next(new AppError(404, 'Book not found'));
    }

    if (book.coverPublicId) {
      await deleteBookCover(book.coverPublicId);
    }

    await BookModel.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(new AppError(500, 'Failed to delete book'));
  }
};

export { getBooks, getBook, addBook, updateBook, deleteBook };
import BookModel from '../database/models/book.model.js';
import AppError from '../utils/customError.js';

const getBooks = async (req) => {
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
  return {
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
  };
};

const getBook = async (id) => {
  const book = await BookModel.findById(id).populate('authors').exec();
  if (!book) throw new AppError(404, 'Book not found try again');
  return book.toDetails();
};

const addBook = async (data) => {
  try {
    const book = await BookModel.create({
      ...data,
    });

    return book;
  } catch (error) {
    return { error };
  }
};

const updateBook = async (data, id) => {
  const book = await BookModel.findById(id).exec();
  if (!book) throw new AppError(404, `Book with ID ${id} not found please try again!`);
  const updatedBook = BookModel.findByIdAndUpdate(id, data, { runValidators: true });
  return updatedBook;
};

const deleteBook = async (id) => {
  const book = await BookModel.findById(id).exec();
  if (!book) throw new AppError(404, `Book with ID ${id} not found please try again!`);
  const deletedBook = BookModel.findByIdAndDelete(id).exec();
  return deletedBook;
};

export { getBooks, getBook, addBook, updateBook, deleteBook };

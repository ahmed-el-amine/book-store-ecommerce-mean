import BookModel from '../database/models/book.model.js';
import AppError from '../utils/customError.js';
import { getCacheData, cacheData, deleteAllCache, deleteCacheData } from '../utils/redis.js';
import httpStatus from 'http-status';

const getBooks = async (req) => {
  // const cacheKey = `books:all:${JSON.stringify(req.query)}`;
  //   const cachedBooks = await getCacheData(cacheKey,req);
  //   if(cachedBooks){
  //     return cachedBooks;
  //   }
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

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: 'authors',
    select: 'title isbn13 description price rating publish_date stock coverImage',
  };

  if (sort) {
    options.sort = sort;
  }

  if (rating) {
    filter.rating = { $gte: rating };
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

  // console.log('Filter:', filter);
  // const books = await BookModel.find(filter).populate('authors').select('title isbn13 description price rating publish_date stock coverImage').exec();
  // // await cacheData(cacheKey, books, 3600, req);
  // return books;
};
const getBook = async (id, req) => {
  const cacheId = `book:${id}`;
  const cacheBook = await getCacheData(cacheId, req);
  if (cacheBook) {
    return cacheBook;
  }
  const book = await BookModel.findById(id).populate('authors').exec();
  await cacheData(cacheId, book, 1800, req);
  if (!book) throw new AppError(httpStatus.NOT_FOUND, 'Book not found try again');
  return book.toDetails();
};

const addBook = async (data,req) => {
  try {
    const book = await BookModel.create({
      ...data,
    });

    //Delete the cache when admin add book
    await deleteAllCache('books:all*', req);

    return book;
  } catch (error) {
    return { error };
  }
};

const updateBook = async (data, id,req) => {
  const book = await BookModel.findById(id).exec();
  if (!book) throw new AppError(httpStatus.NOT_FOUND, `Book with ID ${id} not found please try again!`);
  const updatedBook = BookModel.findByIdAndUpdate(id, data, { runValidators: true });
  await deleteCacheData(`book:${id}`, req);
  await deleteAllCache('books:all*', req);
  return updatedBook;
};

const deleteBook = async (id, req) => {
  const book = await BookModel.findById(id).exec();
  if (!book) throw new AppError(httpStatus.NOT_FOUND, `Book with ID ${id} not found please try again!`);
  const deletedBook = BookModel.findByIdAndDelete(id).exec();
  await deleteAllCache('books:all*', req);
  return deletedBook;
};

export { getBooks, getBook, addBook, updateBook, deleteBook };

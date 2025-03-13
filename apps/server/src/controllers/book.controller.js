import BookModel from '../database/models/book.model.js';
import { uploadBookCover, deleteBookCover } from '../utils/cloudinary.js';

export const getBooks = async (req, res) => {
  try {
    const { categories, price, rating, title } = req.query;
    const filter = {};

    if (categories) filter.categories = { $in: [categories] };
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (price) filter.price = { $gte: price };
    if (rating) filter.rating = { $gte: rating };

    const books = await BookModel.find(filter)
      .populate('authors')
      .select('title isbn13 description price rating publish_date stock coverImage')
      .exec();

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch books' });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id).populate('authors').exec();
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to retrieve book' });
  }
};

export const addBook = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { coverPublicId, coverPublicUrl } = await uploadBookCover(req.file.buffer, req.file.mimetype);

    const bookData = { ...req.body, coverImage: coverPublicUrl, coverPublicId };
    const book = await BookModel.create(bookData);

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to add book' });
  }
};

export const updateBook = async (req, res) => {
  let newPublicId = null;
  try {
    const bookId = req.params.id;
    const existingBook = await BookModel.findById(bookId).exec();
    if (!existingBook) return res.status(404).json({ error: 'Book not found' });

    const updateData = { ...req.body };
    const oldPublicId = existingBook.coverPublicId;

    if (req.file) {
      const { coverPublicUrl, coverPublicId } = await uploadBookCover(req.file.buffer, req.file.mimetype);
      updateData.coverImage = coverPublicUrl;
      updateData.coverPublicId = coverPublicId;
      newPublicId = coverPublicId;
    }

    const updatedBook = await BookModel.findByIdAndUpdate(bookId, updateData, { new: true, runValidators: true });
    if (!updatedBook) {
      if (newPublicId) await deleteBookCover(newPublicId);
      return res.status(404).json({ error: 'Book update failed' });
    }

    if (req.file && oldPublicId) await deleteBookCover(oldPublicId);

    res.status(200).json(updatedBook);
  } catch (error) {
    if (newPublicId) await deleteBookCover(newPublicId);
    res.status(500).json({ error: error.message || 'Failed to update book' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id).exec();
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (book.coverPublicId) await deleteBookCover(book.coverPublicId);
    await BookModel.findByIdAndDelete(req.params.id).exec();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to delete book' });
  }
};

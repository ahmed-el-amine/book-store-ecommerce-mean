import express from 'express';
import authorization from '../middleware/useAuth.middleware.js';
import useZod from '../middleware/useZod.js';
import { bookSchema, patchBookSchema } from '../lib/zod/book.zod.js';
import upload from '../utils/fileStorage.js';
import { bookController } from '../controllers/index.js';
import httpStatus from 'http-status';

const router = express.Router();

router
  .get('/', async (req, res) => {
    const books = await bookController.getBooks(req);
    res.json(books);
  })
  .get('/:id', authorization(['user', 'admin']), async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await bookController.getBook(bookId, req);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve book' });
    }
  })
  .post('/add', authorization(['admin']), upload.single('coverImage'), useZod(bookSchema), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { coverPublicId, coverPublicUrl } = await uploadBookCover(req.file.buffer, req.file.mimetype);

      const bookData = {
        ...req.body,
        coverImage: coverPublicUrl,
        coverPublicId,
      };

      const book = await bookController.addBook(bookData);
      if (book.error) {
        await deleteBookCover(coverPublicId);
        return res.status(404).json({ error: book.error });
      }
      res.status(201).json(book);
    } catch (err) {
      res.status(500).json({
        error: err.message || 'Failed to upload book cover',
      });
    }
  })
  .patch('/:id', authorization(['admin']), upload.single('coverImage'), useZod(patchBookSchema), async (req, res) => {
    let newPublicId = null;
    try {
      const bookId = req.params.id;
      const existingBook = await bookController.getBook(bookId);

      if (!existingBook) {
        return res.status(404).json({ error: 'Book not found' });
      }

      const updateData = { ...req.body };
      const oldPublicId = existingBook.coverPublicId;

      if (req.file) {
        const { coverPublicUrl, coverPublicId } = await uploadBookCover(req.file.buffer, req.file.mimetype);
        updateData.coverImage = coverPublicUrl;
        updateData.coverPublicId = coverPublicId;
        newPublicId = coverPublicId;
      }

      const updatedBook = await bookController.updateBook(updateData, bookId);

      if (!updatedBook) {
        if (newPublicId) await deleteBookCover(newPublicId);
        return res.status(404).json({ error: 'Book update failed' });
      }

      if (req.file && oldPublicId) {
        try {
          await deleteBookCover(oldPublicId);
        } catch {
          throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete old cover');
        }
      }

      res.status(200).json(updatedBook);
    } catch (err) {
      if (newPublicId) {
        try {
          await deleteBookCover(newPublicId);
        } catch {
          throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete new cover');
        }
      }

      res.status(500).json({
        error: err.message || 'Failed to update book',
      });
    }
  })
  .delete('/:id', authorization(['admin']), async (req, res) => {
    try {
      const book = await bookController.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if (book.coverPublicId) {
        await deleteBookCover(book.coverPublicId);
      }
      await bookController.deleteBook(req.params.id, req);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({
        error: err.message || 'Failed to delete book',
      });
    }
  });

export default router;

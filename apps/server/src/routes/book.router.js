import express from 'express';
import authorization from '../middleware/useAuth.middleware.js';
import useZod from '../middleware/useZod.js';
import { bookSchema, patchBookSchema } from '../lib/zod/book.zod.js';
import upload from '../utils/fileStorage.js';
import { bookController } from '../controllers/index.js';
import { uploadBookCover, deleteBookCover } from '../utils/cloudinary.js';
import httpStatus from 'http-status';

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - description
 *         - author
 *         - categories
 *         - stock
 *       properties:
 *         title:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         description:
 *           type: string
 *         author:
 *           type: string
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *         stock:
 *           type: integer
 *         coverImage:
 *           type: string
 *           format: uri
 *         coverPublicId:
 *           type: string
 */

const router = express.Router();

router
  /**
   * @swagger
   * /books:
   *   get:
   *     summary: Get all books
   *     description: Retrieve a list of books with optional filtering
   *     parameters:
   *       - in: query
   *         name: categories
   *         schema:
   *           type: string
   *         description: Filter by category (comma-separated for multiple)
   *       - in: query
   *         name: minPrice
   *         schema:
   *           type: number
   *         description: Minimum price
   *       - in: query
   *         name: maxPrice
   *         schema:
   *           type: number
   *         description: Maximum price
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of books per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search in title and description
   *     responses:
   *       200:
   *         description: A list of books
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 books:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Book'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     totalItems:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *                     currentPage:
   *                       type: integer
   */
  .get('/', async (req, res) => {
    const books = await bookController.getBooks(req);
    res.json(books);
  })

  /**
   * @swagger
   * /books/{id}:
   *   get:
   *     summary: Get a book by ID
   *     description: Retrieves detailed information about a specific book
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Book ID
   *     responses:
   *       200:
   *         description: Book details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       404:
   *         description: Book not found
   */
  .get('/:id', async (req, res) => {
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

  /**
   * @swagger
   * /books/add:
   *   post:
   *     summary: Add a new book
   *     description: Creates a new book (admin only)
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - price
   *               - description
   *               - author
   *               - categories
   *               - stock
   *               - coverImage
   *             properties:
   *               title:
   *                 type: string
   *               price:
   *                 type: number
   *               description:
   *                 type: string
   *               author:
   *                 type: string
   *               categories:
   *                 type: array
   *                 items:
   *                   type: string
   *               stock:
   *                 type: integer
   *               coverImage:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Book created successfully
   *       400:
   *         description: Invalid input or missing file
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - requires admin role
   */
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

      const book = await bookController.addBook(bookData, req);
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
      const existingBook = await bookController.getBook(bookId, req);

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
      const updatedBook = await bookController.updateBook(updateData, bookId, req);

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
      const book = await bookController.getBook(req.params.id, req);
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

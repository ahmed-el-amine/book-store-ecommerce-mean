import express from 'express';
import authorization from '../middleware/useAuth.middleware.js';
import { getBooks, getBook, addBook, updateBook, deleteBook } from '../controllers/book.controller.js';
import useZod from '../middleware/useZod.js';
import { bookSchema, patchBookSchema } from '../lib/zod/book.zod.js';
import upload from '../utils/fileStorage.js';

const router = express.Router();

router
  .get('/', authorization(['user', 'admin']), getBooks) // Directly use getBooks
  .get('/:id', authorization(['user', 'admin']), getBook) // Directly use getBook
  .post('/add', authorization(['admin']), upload.single('coverImage'), useZod(bookSchema), addBook) // Directly use addBook
  .patch('/:id', authorization(['admin']), upload.single('coverImage'), useZod(patchBookSchema), updateBook) // Directly use updateBook
  .delete('/:id', authorization(['admin']), deleteBook);

export default router;

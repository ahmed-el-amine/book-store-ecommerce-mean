import express from 'express';
import {authorizeAdmin} from '../middleware/security/authorization.js';
import  authorization  from '../middleware/useAuth.middleware.js';
import {bookController} from '../controllers/index.js';
import useZod from '../middleware/useZod.js';
import { bookSchema,patchBookSchema } from '../lib/zod/book.zod.js';


const router = express.Router();

router
.get('/', authorization(['user','admin']),async (req,res)=>{
    const books = await bookController.getBooks();
    res.json(books);
})
.get('/:id',authorization(['user','admin']),async(req,res)=>{
  const book = await bookController.getBook(req.params.id);
  res.json(book);
})
.post('/add',authorization(['admin']),useZod(bookSchema),async (req,res)=>{
    const book = await bookController.addBook(req.body);
    res.status(201).json(book);
})
.patch('/:id',authorization(['admin']),useZod(patchBookSchema),async(req,res)=>{
    const updatedBook = await bookController.updateBook(req.body,req.params.id);
    res.status(200).json(updatedBook);
})
.delete('/:id',authorization(['admin']),async(req,res)=>{
     await bookController.deleteBook(req.params.id);
     res.status(204).end();
})

export default router;

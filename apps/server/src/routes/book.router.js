import express from 'express';
import {authorizeAdmin} from '../middleware/security/authorization.js';
import {bookController} from '../controllers/index.js';
import useZod from '../middleware/useZod.js';
import { bookSchema,patchBookSchema } from '../lib/zod/book.zod.js';


const router = express.Router();

router
.get('/', authorizeAdmin,async (req,res,next)=>{
    const books = await bookController.getBooks();
    res.json(books);
})
.post('/add',authorizeAdmin,useZod(bookSchema),async (req,res,next)=>{
    const book = await bookController.addBook(req.body);
    res.status(201).json(book);
})
.patch('/:id',authorizeAdmin,useZod(patchBookSchema),async(req,res,next)=>{
    const updatedBook = await bookController.updateBook(req.body,req.params.id);
    res.status(200).json(updatedBook);
})
.delete('/:id',authorizeAdmin,async(req,res,next)=>{
     await bookController.deleteBook(req.params.id);
     res.status(204).end();
})

export default router;

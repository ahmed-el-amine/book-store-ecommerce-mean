import express from 'express';
import {authorizeAdmin} from '../middleware/security/authorization.js';
import {bookController} from '../controllers/index.js';
import useZod from '../middleware/useZod.js';
import { bookSchema,patchBookSchema } from '../lib/zod/book.zod.js';


const router = express.Router();

router
.get('/', authorizeAdmin,async (req,res,next)=>{
  try{
    const books = await bookController.getBooks();
    res.json(books);
  }catch(error){
    next(error);
  }

})
.post('/add',authorizeAdmin,useZod(bookSchema),async (req,res,next)=>{
  try{
    const book = await bookController.addBook(req.body);
    res.status(201).json(book);
  }catch(error){
    res.status(400).json({message:`Invalid data please insert data again, ${error.message}`});
  }
})
.patch('/:id',authorizeAdmin,useZod(patchBookSchema),async(req,res,next)=>{
  try{
    const updatedBook = await bookController.updateBook(req.body,req.params.id);
    res.status(200).json(updatedBook);
  }catch(error){
   res.status(400).json({message:`Invalid data please insert data again, ${error.message}`});
  }
})
.delete('/:id',authorizeAdmin,async(req,res,next)=>{
  try{
     await bookController.deleteBook(req.params.id);
    res.status(204).end();
  }catch(error){
    res.status(500).json({message:`Can't delete book some thing wrong happened, ${error.message}`});
  }
})

export default router;

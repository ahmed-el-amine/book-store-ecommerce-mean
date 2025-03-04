import BookModel from '../database/models/book.model.js';
import AppError from '../utils/customError.js';

const getBooks = async ()=>{
   const books = await BookModel.find().exec();
   return books;
};


const addBook = async (data)=>{
    const {title,isbn13,description,price,rating,publish_date,stock,coverImage,dimensions,weight,authors,categories} = data;
    const book = BookModel.create({
      title,
      isbn13,
      description,
      price,rating,
      publish_date,
      stock,
      coverImage,
      dimensions,
      weight,
      authors,
      categories
    });
    return book;
}

const updateBook = async(data,id)=>{
  const book = await BookModel.findById(id);
  if(!book) throw new AppError(`Book with ID ${id} not found please try again!`,404);
  const updatedBook = BookModel.findByIdAndUpdate(id,data,{runValidators:true});
  return updatedBook;
}

const deleteBook = async(id)=>{
  const book = await BookModel.findById(id);
  if(!book) throw new AppError(`Book with ID ${id} not found please try again!`,404);
  const deletedBook = BookModel.findByIdAndDelete(id);
  return deletedBook;
}



export{
  getBooks,
  addBook,
  updateBook,
  deleteBook
}

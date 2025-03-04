import BookModel from '../database/models/book.model.js';
import AppError from '../utils/customError.js';

const getBooks = async ()=>{
   const books = await BookModel.find().exec();
   return books;
};

const getBook = async(id)=>{
  const book  = await BookModel.findById(id).exec();
  if(!book) throw new AppError(404,'Book not found try again');
  return book;
}


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
  const book = await BookModel.findById(id).exec();
  if(!book) throw new AppError(404,`Book with ID ${id} not found please try again!`);
  const updatedBook = BookModel.findByIdAndUpdate(id,data,{runValidators:true});
  return updatedBook;
}

const deleteBook = async(id)=>{
  const book = await BookModel.findById(id).exec();
  if(!book) throw new AppError(404,`Book with ID ${id} not found please try again!`);
  const deletedBook = BookModel.findByIdAndDelete(id).exec();
  return deletedBook;
}



export{
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook
}

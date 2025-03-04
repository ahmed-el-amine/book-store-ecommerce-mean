import BookModel from '../database/models/book.model.js';
//import AppError from '../middleware/errorHandler/index.js';

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
  if(!book) throw new Error(`Book with ID ${id} not found please try again!`);
  const updatedBook = BookModel.findByIdAndUpdate(id,data,{runValidators:true});
  return updatedBook;
}

const deleteBook = async(id)=>{
  const book = await BookModel.findById(id);
  if(!book) throw new Error(`Book with ID ${id} not found please try again!`);
  const deletedBook = BookModel.findByIdAndDelete(id);
  return deletedBook;
}



export{
  getBooks,
  addBook,
  updateBook,
  deleteBook
}

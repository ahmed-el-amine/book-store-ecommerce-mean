import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'FirstName is required'],
    trim: true,
    minlength: [3, 'FirstName must be at least 3 characters'],
    maxlength: [15, 'FirstName cannot exceed 30 characters'],
    match: [
      /^[a-zA-Z]+$/,
      'FirstName can only contain letters, no spaces, numbers or special characters',
    ],
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required'],
    trim: true,
    minlength: [3, 'lastName must be at least 3 characters'],
    maxlength: [15, 'lastName cannot exceed 30 characters'],
    match: [
      /^[a-zA-Z]+$/,
      'lastName can only contain letters, no spaces, numbers or special characters',
    ],
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    minLength: [30, 'Bio must be at least 30 charachters'],
    maxLength: [400, 'Bio cannot exceed 400 characters'],
  },
  booksWritten: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
});

authorSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      id: ret._id,
      firstName: ret.firstname,
      lastName: ret.lastname,
      booksWritten: ret.booksWritten,
    };
  },
});

const Author = mongoose.model('Author', authorSchema);

export default Author;

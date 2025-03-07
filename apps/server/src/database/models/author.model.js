import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import logger from '../../lib/winston/index.js';

//To get the file path dirname don't work
const getFilePath = (relativePath)=>{
  const projectRoot = process.cwd();
  return path.join(projectRoot,relativePath);
}


const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'FirstName is required'],
    trim: true,
    minlength: [3, 'FirstName must be at least 3 characters'],
    maxLength: [15, 'FirstName cannot exceed 30 characters'],
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
    maxLength: [15, 'lastName cannot exceed 30 characters'],
    match: [
      /^[a-zA-Z]+$/,
      'lastName can only contain letters, no spaces, numbers or special characters',
    ],
  }
},{timestamps:true});


authorSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

authorSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      id: ret._id,
      firstName: ret.firstName,
      lastName: ret.lastName,
      booksWritten: ret.booksWritten,
    };
  },
});


const Author = mongoose.model('Author', authorSchema);


 export const importDataOfAuthors = () => {
  return new Promise((resolve, reject) => {
    let counter = 0;
    const stream = fs.createReadStream(getFilePath('data/books.csv')).pipe(csv({ separator: ';' }));

    //Function to process the data row by row
     stream.on('data',async (row) => {
        stream.pause();
         if (counter >= 50) {
            stream.destroy(); // Hard stop when we reach 50
            logger.info('50 authors imported, stopping import process');
            return resolve();
          }
        const fullName = row['Book-Author'];
        if (fullName) {
          const nameParts = fullName.split(' ');
          //Remove every thing expect characters from the name
          const firstName = nameParts[0].replace(/[^a-zA-Z]/g, '');
          const lastName = nameParts[nameParts.length - 1].replace(/[^a-zA-Z]/g, '');

          try {
            const author = new Author({ firstName, lastName });
            await author.save();
            counter++;

            logger.info(`Saved author: ${firstName} ${lastName}`);

            if(counter>=50) {
              stream.destroy();
              logger.info('50 record imported to the database');
              resolve();
              return;
            }else{
              stream.resume();
            }
          } catch (err) {
            logger.error('Error saving author: ', err.message);
            stream.resume();
          }

        }
    });

    stream.on('end', () => {
      logger.info('CSV file successfully added to the database');
      resolve();
    });



    stream.on('error', (error) => {
      logger.error('Error processing csv file try again', error);
      reject(error);
    });
  });
};





export default Author;

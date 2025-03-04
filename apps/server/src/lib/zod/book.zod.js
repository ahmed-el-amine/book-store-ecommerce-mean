import {z} from 'zod';
import mongoose from 'mongoose';


const objectIdSchema = z.string().refine(
  (value)=>mongoose.Types.ObjectId.isValid(value),
  {
    message:'Invalid objectId format'
  }
)


const dimensionsSchema = z.object({
  width:z.number().gte(1),
  height:z.number().gte(1),
  depth:z.number().gte(1),
  unit:z.string().default('cm')
});

const weightSchema = z.object({
  value:z.number(),
  unit:z.string().default('g')
});

export const bookSchema = z.object({
  title:z.string()
  .min(5,'Book title must be 5 character at least'),
  isbn13:z.string()
  .min(13,'ISBN-13 must be 13 characters'),
  description:z.string().
  min(15,'Book description must be 15 character at least')
  ,price:z.number()
  ,rating:z.number(),
  publish_date:z.preprocess((value)=>new Date(value),z.date()),
  stock:z.number().gte(0),
  coverImage:z.string(),
  dimensions:dimensionsSchema,
  weight:weightSchema,
  authors:z.array(objectIdSchema).nonempty({
    message:'At least one author required!'
  }),
  categories:z.string().array().nonempty({
    message:'At least one category required!'
  })
})

export const patchBookSchema = bookSchema.partial();

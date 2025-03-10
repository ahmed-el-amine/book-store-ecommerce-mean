import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine(
  (value) => mongoose.Types.ObjectId.isValid(value),
  { message: 'Invalid objectId format' }
);

const dimensionsSchema = z.object({
  width: z.number().gte(1),
  height: z.number().gte(1),
  depth: z.number().gte(1),
  unit: z.string().default('cm')
}).strict();

const weightSchema = z.object({
  value: z.number(),
  unit: z.string().default('g')
}).strict();

export const bookSchema = z.object({
  title: z.string()
    .min(5, 'Book title must be 5 characters at least')
    .trim(),
  isbn13: z.string()
    .length(13, 'ISBN-13 must be exactly 13 characters')
    .regex(/^\d{13}$/, 'ISBN-13 must contain only numbers'),
  description: z.string()
    .min(15, 'Book description must be 15 characters at least')
    .trim(),
  price: z.coerce.number()
    .positive('Price must be a positive number'),
  rating: z.coerce.number()
    .min(0, 'Rating cannot be less than 0')
    .max(5, 'Rating cannot be more than 5'),
  publish_date: z.preprocess((val) => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }, z.date()
    .max(new Date(), 'Publish date cannot be in the future')
  ),
  stock: z.coerce.number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  dimensions: z.preprocess(
    val => typeof val === 'string' ? JSON.parse(val) : val,
    dimensionsSchema
  ),
  weight: z.preprocess(
    val => typeof val === 'string' ? JSON.parse(val) : val,
    weightSchema
  ),
  authors: z.preprocess(
    val => typeof val === 'string' ? val.split(',') : val,
    z.array(objectIdSchema)
      .nonempty('At least one author required!')
  ),
  categories: z.preprocess(
    val => typeof val === 'string' ? val.split(',').map(s => s.trim()) : val,
    z.array(z.string().min(1))
      .nonempty('At least one category required!')
  )
}).strict();

export const patchBookSchema = bookSchema.partial();
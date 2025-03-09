import { z } from 'zod';

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: 'Invalid ObjectId format',
});

const cartItemSchema = z
  .object({
    bookId: ObjectIdSchema,
    quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }),
    price: z.number().nonnegative({ message: 'Price cannot be negative' }),
    title: z.string().min(1, { message: 'Book title is required' }),
    coverImage: z.string().optional(),
  })
  .strip();

export const addToCartSchema = z
  .object({
    userId: ObjectIdSchema,
    bookId: ObjectIdSchema,
    quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }).default(1),
  })
  .strip();

export const removeFromCartSchema = z
  .object({
    userId: ObjectIdSchema,
    bookId: ObjectIdSchema,
  })
  .strip();

export const updateCartSchema = z
  .object({
    userId: ObjectIdSchema,
    items: z.array(cartItemSchema).nonempty({ message: 'Cart must contain at least one item' }),
  })
  .strip();

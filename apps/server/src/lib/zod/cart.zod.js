import { z } from 'zod';

// ObjectId validation schema
const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: 'Invalid ObjectId format',
});

// Schema for adding items to cart
export const addToCartSchema = z
  .object({
    userId: ObjectIdSchema,
    bookId: ObjectIdSchema,
    quantity: z
      .number()
      .int()
      .positive({ message: 'Quantity must be a positive integer' })
      .default(1),
  })
  .strip();

// Schema for removing items from cart
export const removeFromCartSchema = z
  .object({
    userId: ObjectIdSchema,
    bookId: ObjectIdSchema,
  })
  .strip();

// Cart item schema for cart updates
const cartItemSchema = z
  .object({
    bookId: ObjectIdSchema,
    quantity: z
      .number()
      .int()
      .positive({ message: 'Quantity must be a positive integer' }),
  })
  .strip();

// Schema for updating cart
export const updateCartSchema = z
  .object({
    userId: ObjectIdSchema,
    items: z
      .array(cartItemSchema)
      .nonempty({ message: 'Cart must contain at least one item' }),
  })
  .strip();

// Schema for getting cart
export const getCartSchema = z
  .object({
    userId: ObjectIdSchema,
  })
  .strip();

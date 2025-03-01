import { z } from 'zod';

const addressSchema = z
  .object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('United States'),
    isDefault: z.boolean().default(false),
  })
  .strip();

const baseUser = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores'
      ),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string(),
    lastName: z.string(),
    address: z.array(addressSchema).optional(),
    email: z.string().email('Please provide a valid email address'),
    phone: z.string().optional(),
  })
  .strip();

export const createUserSchema = baseUser;

export const loginUserSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strip();

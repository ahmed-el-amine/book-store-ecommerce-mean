import { z } from 'zod';

const addressSchema = z
  .object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    isDefault: z.boolean().default(false),
  })
  .strip();

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

const baseUser = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string(),
    lastName: z.string(),
    address: z.array(addressSchema).optional(),
    email: z.string().email('Please provide a valid email address'),
    phone: z.string().regex(phoneRegex, 'Invalid Number!').or(z.literal('')).optional(),
  })
  .strip();

export const createUserSchema = baseUser.omit({ address: true }).strip();

export const updateUserSchema = baseUser
  .omit({ username: true, address: true })
  .partial()
  .strip()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided for update', path: [] });

export const loginUserSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strip();

export const addUserAddressSchema = addressSchema.strip();

export const updateUserAddressSchema = addressSchema
  .partial()
  .strip()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided for update', path: [] });

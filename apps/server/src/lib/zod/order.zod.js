import { z } from 'zod';


export const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
});

export const OrderItemSchema = z.object({
    bookId: z.string(),
    title: z.string(),
    quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
    price: z.number().min(0, { message: 'Price cannot be negative' }),
    coverImage: z.string().optional(),
});

export const OrderSchema = z.object({
    orderNumber: z.string().optional(),
    userId: z.string(),
    items: z.array(OrderItemSchema).refine(
        (items) => {
            const ids = items.map(item => item.bookId);
            return new Set(ids).size === ids.length;
        },
        { message: 'Duplicate book IDs are not allowed in order items' }
    ),
    status: z.enum(['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded']),
    paymentMethod: z.enum(['Stripe', 'Cash on Delivery']),
    paymentStatus: z.enum(['Pending', 'Paid', 'Failed', 'Refunded']),
    shippingAddress: AddressSchema,
    estimatedDeliveryDate: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
        },
        z.date().refine((date) => date > new Date(), {
            message: 'Estimated delivery date must be in the future',
        })
    ),
    notes: z.string().max(500, { message: 'Notes cannot exceed 500 characters' }).optional(),
    discountApplied: z.number().min(0).default(0),
    taxAmount: z.number().min(0).default(0),
});

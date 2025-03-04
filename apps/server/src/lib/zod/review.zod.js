import { z } from 'zod';

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid ObjectId format",
});

export const reviewSchema = z.object({
    userId: ObjectIdSchema,
    bookId: ObjectIdSchema,
    rating: z.number().min(1, { message: "Rating must be between 1 and 5" }).max(5, { message: "Rating must be between 1 and 5" }),
    comment: z.string()
        .min(30, { message: "Comment must be at least 30 characters" })
        .max(300, { message: "Comment cannot exceed 300 characters" })
        .trim()
        .refine(value => value.trim().length > 0, { message: "Comment cannot be just spaces" }),
    createdAt: z.date().default(new Date()),
})
    .strip();


export const patchReviewSchema = reviewSchema.partial();

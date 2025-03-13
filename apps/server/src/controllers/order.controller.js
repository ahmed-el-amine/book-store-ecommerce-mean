import mongoose from 'mongoose';
import Books from '../database/models/book.model.js';
import Order from '../database/models/order.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';

export const placeOrder = async (req, res, next) => {
    try {
        const {
            items,
            totalPrice,
            shippingAddress,
            estimatedDeliveryDate,
            notes,
            discountApplied,
            taxAmount,
            paymentMethod,
            paymentStatus,
            status,
        } = req.body;

        const userId = req.userId;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            for (const item of items) {


                const book = await Books.findById(item.bookId).session(session).exec();


                if (!book) {
                    throw new AppError(`Book with ID ${item.bookId} not found`, 404);
                }

                if (book.quantity < item.quantity) {
                    throw new AppError(`Insufficient stock for book: ${book.title}`, 400);
                }




                const updatedBook = await Books.findOneAndUpdate(
                    { _id: item.bookId, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { new: true, session }
                ).exec();


                if (!updatedBook) {
                    throw new AppError(`${book.title} is out of stock`, 500);
                }

                console.log("Updated book:", updatedBook);
                console.log("Book Id:", item.bookId, "Item quantity:", item.quantity, "Updated stock:", updatedBook.quantity);

                // Enrich order item with current price and book details
                item.price = book.price;
                item.title = book.title;
                item.coverImage = book.coverImage;
            }


            const order = await Order.create([{
                userId,
                items,
                totalPrice,
                shippingAddress,
                estimatedDeliveryDate,
                notes,
                discountApplied,
                taxAmount,
                paymentMethod,
                paymentStatus,
                status,
            }], { session });



            // Commit the transaction
            await session.commitTransaction();
            session.endSession();


            res.status(201).json({
                success: true,
                message: "Order placed successfully",
                data: order,
            });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error during transaction:", err);
            next(new AppError(err.message, err.statusCode || 500));
        }
    } catch (err) {
        console.error("Error while placing order:", err);
        next(new AppError("Error while placing order: " + err.message, 500));
    }
};
export const getOrders = async (req, res, next) => {
    try {
        // For production, use req.userId (set by authentication middleware)
        const userId = req.userId
        const orders = await Order.find(userId);
        res.json(orders);
    } catch (err) {
        next(new Error('Error while getting orders: ' + err.message));
    }
};

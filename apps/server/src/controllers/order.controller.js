import mongoose from 'mongoose';
import Books from '../database/models/book.model.js';
import Order from '../database/models/order.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';

export const placeOrder = async (req, res, next) => {
  try {
    const { items, totalPrice, shippingAddress, estimatedDeliveryDate, notes, discountApplied, taxAmount, paymentMethod, status } = req.body;

    const userId = req.userId; // Ensure authentication middleware sets req.userId
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Process each item in the order: update stock and enrich item details
      for (const item of items) {
        console.log('Processing item:', item);

        // Step 1: Check if the book exists and has sufficient stock
        const book = await Books.findById(item.bookId).session(session).exec();
        console.log('Book found:', book);

        if (!book) {
          throw new AppError(httpStatus.NOT_FOUND, `Book with ID ${item.bookId} not found`);
        }

        if (book.quantity < item.quantity) {
          throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for book: ${book.title}`);
        }

        // Step 2: Update the stock
        console.log(`Updating book ${item.bookId}: Reducing quantity by ${item.quantity}. Current stock: ${book.quantity}`);

        const updatedBook = await Books.findOneAndUpdate(
          { _id: item.bookId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        ).exec();

        if (!updatedBook) {
          throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `${book.title} is out of stock`);
        }

        console.log('Updated book:', updatedBook);
        console.log('Book Id:', item.bookId, 'Item quantity:', item.quantity, 'Updated stock:', updatedBook.quantity);

        // Enrich order item with current price and book details
        item.price = book.price;
        item.title = book.title;
        item.coverImage = book.coverImage;
      }

      // Step 3: Create the order document within the transaction session
      const order = await Order.create(
        [
          {
            userId,
            items,
            totalPrice,
            shippingAddress,
            estimatedDeliveryDate,
            notes,
            discountApplied,
            taxAmount,
            paymentMethod,
            status,
          },
        ],
        { session }
      );

      console.log('Order created successfully:', order);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Respond with success
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error during transaction:', err);
      next(new AppError(err.statusCode || 500, err.message));
    }
  } catch (err) {
    console.error('Error while placing order:', err);
    next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while placing order: ' + err.message));
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

import mongoose from 'mongoose';
import Books from '../database/models/book.model.js';
import Order from '../database/models/order.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';
import Cart from '../database/models/cart.model.js';
import { notificationType } from '../database/models/notification.model.js';
import { create } from '../services/notifications.service.js';
import { sendNotificationToUser } from '../services/socket.service.js';

export const placeOrder = async (req, res, next) => {
  try {
    const { items, totalPrice, shippingAddress, estimatedDeliveryDate, notes, discountApplied, taxAmount, paymentMethod, paymentStatus, status } =
      req.body;

    const userId = req.user._id;
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
          res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: `${book.title} is out of stock`,
          });
        }

        // Enrich order item with current price and book details
        item.price = book.price;
        item.title = book.title;
        item.coverImage = book.coverImage;
      }

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
            paymentStatus,
            status,
          },
        ],
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(httpStatus.CREATED).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });

      // delete user cart
      await Cart.findOneAndDelete({ userId });
      // send websocket notification
      const notification = await create({
        title: 'Order Placed Successfully',
        message: 'Your order has been placed and is being processed.',
        type: notificationType.SUCCESS,
        userId,
      });
      sendNotificationToUser(notification);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error during transaction:', err);
      next(new AppError(err.message, err.statusCode || 500));
    }
  } catch (err) {
    console.error('Error while placing order:', err);
    next(new AppError('Error while placing order: ' + err.message, 500));
  }
};
export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortBy = req.query.sort || '-createdAt';
    const status = req.query.status;

    // Build query object
    const query = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Execute paginated query with virtuals enabled
    const options = {
      page,
      limit,
      sort: sortBy,
      customLabels: {
        docs: 'orders',
        totalDocs: 'totalOrders',
      },
    };

    const result = await Order.paginate(query, options);

    res.json({
      orders: result.orders,
      pagination: {
        totalOrders: result.totalOrders,
        totalPages: result.totalPages,
        currentPage: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      },
    });
  } catch (err) {
    next(new AppError('Error while getting orders: ' + err.message, 500));
  }
};

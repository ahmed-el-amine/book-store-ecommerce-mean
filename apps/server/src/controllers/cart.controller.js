import Books from '../database/models/book.model.js';
import Cart from '../database/models/cart.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';

export const addToCart = async (req, res, next) => {
  const { userId, bookId, quantity } = req.body;

  const book = await Books.findById(bookId);
  if (!book) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Book not found'));
  }

  if (book.stock < quantity) {
    return next(new AppError(httpStatus.BAD_REQUEST, 'Not enough stock available'));
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [{ bookId, quantity, price: book.price, title: book.title, coverImage: book.coverImage }] });
  } else {
    const itemIdx = cart.items.findIndex((item) => item.bookId.toString() === bookId);

    if (itemIdx > -1) {
      cart.items[itemIdx].quantity += quantity;
    } else {
      cart.items.push({
        bookId,
        quantity,
        price: book.price,
        title: book.title,
        coverImage: book.coverImage,
      });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  await cart.save();
  res.status(httpStatus.OK).json({ message: 'Item added to the cart', cart });
};

export const removeFromCart = async (req, res, next) => {
  const { userId, bookId } = req.body;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Cart not found for this user'));
  }

  cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);
  cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

  await cart.save();

  res.status(httpStatus.OK).json({ message: 'Item removed from cart', cart });
};

export const getCart = async (req, res, next) => {
  const { userId } = req.params;

  const cart = await Cart.findOne({ userId }).populate('items.bookId');

  if (!cart) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Cart not found'));
  }
  res.status(httpStatus.OK).json(cart);
};

export const updateCart = async (req, res, next) => {
  const { userId, items } = req.body;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Cart not found'));
  }

  cart.items = items;
  cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

  await cart.save();
  res.status(httpStatus.OK).json({ message: 'Cart updated successfully', cart });
};

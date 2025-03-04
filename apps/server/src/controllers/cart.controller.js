import Cart from '../database/models/cart.model.js';
import logger from '../lib/winston/index.js';
import AppError from '../utils/customError.js';

export const addToCart = async (req, res, next) => {
  const { userId, bookId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [{ bookId, quantity }] });
    } else {
      const itemIdx = cart.items.findIndex(
        (item) => item.bookId.toString() === bookId
      );

      if (itemIdx > -1) {
        cart.items[itemIdx].quantity += quantity;
      } else {
        cart.items.push({ bookId, quantity });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to the cart', cart });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

export const removeFromCart = async (req, res, next) => {
  const { userId, bookId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(new AppError('Cart not found for this user', 404));
    }

    cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getCart = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const cart = Cart.findOne({ userId });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }
    res.status(200).json(cart);
  } catch (error) {
    logger.error(error);
    return next(new AppError('Error retrievin cart', 500));
  }
};

export const updateCart = async (req, res, next) => {
  const { userId, items } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = items;

    cart.totalPrice = cart.items.reduce(
      (total, item) => total * (item.quantity * item.price)
    );

    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    logger.error(error);
    return next(new AppError('Error updating cart', 500));
  }
};

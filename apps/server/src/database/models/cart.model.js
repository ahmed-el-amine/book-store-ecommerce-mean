import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books',
    required: [true, 'Book ID is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  title: {
    type: String,
    required: [true, 'Book title is required'],
  },
  coverImage: {
    type: String,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

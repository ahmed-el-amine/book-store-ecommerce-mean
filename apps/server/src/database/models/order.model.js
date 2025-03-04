import mongoose from 'mongoose';
import { addressSchema } from './user.model.js';

const orderItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book ID is required']
    },
    title: {
        type: String,
        required: [true, 'Book title is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    coverImage: {
        type: String
    }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    items: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: [true, 'Please provide total price'],
        min: [0, 'Total price cannot be negative']
    },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Processing',
        index: true
    },
    paymentMethod: {
        type: String,
        enum: ['Stripe', 'Cash on Delivery'],
        default: 'Stripe'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending',
        index: true
    },
    shippingAddress: {
        type: addressSchema,
        required: [true, 'Shipping address is required']
    },
    estimatedDeliveryDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Estimated delivery date must be in the future'
        }
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    discountApplied: {
        type: Number,
        default: 0,
        min: 0
    },
    taxAmount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, status: 1 });

orderSchema.virtual('subtotal').get(function () {
    return this.totalPrice + this.discountApplied - this.taxAmount;
});

orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

orderSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    let isUnique = false;
    while (!isUnique && attempts < MAX_ATTEMPTS) {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        this.orderNumber = `ORD-${randomNumber}`;
        const existingOrder = await this.constructor.exists({ orderNumber: this.orderNumber });
        if (!existingOrder) {
            isUnique = true;
        }
        attempts++;
    }
    if (!isUnique) {
        return next(new Error('Failed to generate a unique order number after multiple attempts'));
    }
    next();
});


orderSchema.pre('save', function (next) {
    if (this.status === 'Shipped' || this.status === 'Delivered') {
        this.paymentStatus = 'Paid';
    }
    next();
});



const Order = mongoose.model('Order', orderSchema);
export default Order;
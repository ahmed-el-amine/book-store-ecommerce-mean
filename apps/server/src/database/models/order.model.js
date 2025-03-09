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
        min: [0, 'Price cannot be negative'],
        set: value => Math.round(value * 100),
        get: value => (value / 100).toFixed(2)
    },
    coverImage: {
        type: String
    }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    items: [orderItemSchema],
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
    discountApplied: {
        type: Number,
        default: 0,
        min: 0
    },
    taxAmount: {
        type: Number,
        default: 0,
        min: 0
    },

}, {
    timestamps: true
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, status: 1 });

orderSchema.virtual('subtotal').get(function () {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

orderSchema.virtual('totalPrice').get(function () {
    return this.subtotal - this.discountApplied + this.taxAmount;
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

    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 9000 + 1000);
    this.orderNumber = `ORD-${timestamp}-${random}`;


    next();
});


orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        if (this.paymentMethod === 'Cash on Delivery') {
            this.paymentStatus = this.status === 'Delivered' ? 'Paid' : 'Pending';
        } else {
            if (['Shipped', 'Delivered'].includes(this.status)) {
                this.paymentStatus = 'Paid';
            }
        }
    }
    next();
});


const Order = mongoose.model('Order', orderSchema);
export default Order;
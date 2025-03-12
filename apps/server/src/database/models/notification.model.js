import mongoose from 'mongoose';

export const notificationType = Object.freeze({
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
});

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    type: {
      type: String,
      enum: Object.values(notificationType),
      default: notificationType.INFO,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      id: ret._id,
      message: ret.message,
      type: ret.type,
      isRead: ret.isRead,
    };
  },
});

export const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

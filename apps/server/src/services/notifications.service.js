import mongoose from 'mongoose';
import Notification, { notificationType } from '../database/models/notification.model.js';

export const notificationProps = {
  userId: '',
  title: '',
  message: '',
  type: notificationType.INFO,
};

export const create = async (props = notificationProps) => {
  if (!props.title || !props.message || !props.userId || !props.type) return null;
  if (!mongoose.isValidObjectId(props.userId)) return null;

  try {
    return await Notification.create(props);
  } catch (error) {
    return null;
  }
};

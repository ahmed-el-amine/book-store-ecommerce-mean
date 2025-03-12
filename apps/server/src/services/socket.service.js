import { getSocketIO, getSocketUsers } from '../socket/socketIOHandler';
import { notificationProps } from './notifications.service.js';

// const notificationProps = {
//   message: '',
//   type: 'info',
// };

// export const sendNotificationToAll = async (props = notificationProps) => {
//   const io = getSocketIO();
//   if (!io) return;

//   console.log('Sending notification to all clients');

//   io.sockets.emit('notification', props);
// };

export const sendNotificationToUser = async (notification = notificationProps) => {
  const io = getSocketIO();

  if (!io) return;

  // send notification to specific user
  const sockets = getSocketUsers();
  if (!sockets || sockets.size <= 0) return;

  const user = sockets.get(notification.userId.toString());

  if (!user || !user.sockets || user.sockets.length <= 0) return;

  io.sockets.sockets.forEach((socket) => {
    if (socket.userId === notification.userId.toString()) {
      socket.emit('notification', JSON.stringify(notification));
    }
  });
};

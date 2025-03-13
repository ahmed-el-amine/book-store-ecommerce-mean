import { Server } from 'socket.io';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { getSocketUsers } from './socketIOHandler';

const socketIOSetup = (expressApp) => {
  const socketIO = new Server(expressApp, {
    pingTimeout: 10000, // 10s
    pingInterval: 15000, // 15s
    cors: {
      origin: `${CLIENT_WEBSITE_URL}`,
      credentials: true,
    },
    allowEIO3: true,
  });

  global.socketIO = socketIO;

  socketIO.use(userSocketIOAuth);

  socketIO.on('connection', (socket) => {
    handleSocketIOStatus({ socket, status: 'Online' });

    socket.on('disconnect', () => {
      handleSocketIOStatus({ socket, status: 'Offline' });
    });

    socket.on('connection_error', () => {
      handleSocketIOStatus({ socket, status: 'Offline' });
    });
  });
};

export default socketIOSetup;

const userSocketIOAuth = (socket, next) => {
  let cookies = {};
  try {
    cookies = parse(socket.handshake.headers.cookie || '');
  } catch (_) {
    return next(new Error(JSON.stringify({ message: 'Unauthorized' })));
  }

  // verify the token
  const token = cookies[process.env.JWT_Cookie_Name];

  if (!token) return next(new Error(JSON.stringify({ message: 'Unauthorized' })));

  try {
    const payload = jwt.verify(token, process.env.JWT_SEC_KEY);
    socket.userId = payload.id;
    return next();
  } catch (error) {
    return next(new Error(JSON.stringify({ message: 'Unauthorized' })));
  }
};

const handleSocketIOStatus = ({ socket, status } = {}) => {
  if (!socket) return;

  const map = getSocketUsers();
  if (status == 'Online') {
    if (map.has(socket.userId)) {
      const user = map.get(socket.userId);
      user.sockets.push(socket.id);
    } else {
      map.set(socket.userId, {
        sockets: [socket.id],
      });
    }
  } else if (status == 'Offline') {
    if (map.has(socket.userId)) {
      const user = map.get(socket.userId);
      user.sockets = user.sockets.filter((s) => s !== socket.id);
      if (user.sockets.length === 0) {
        map.delete(socket.userId);
      }
    }
  }
};

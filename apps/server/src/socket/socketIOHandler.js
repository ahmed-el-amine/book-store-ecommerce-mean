/**
 * @returns {import("socket.io").Server}
 */
export const getSocketIO = () => global.socketIO;

const socketUsers = new Map();
/**
 * @returns {Map<string, any>}
 */
export const getSocketUsers = () => {
  return socketUsers;
};

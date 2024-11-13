import { userSocketIDs } from "../server.js";

export const getSocketMembers = (users = []) => {
  const sockets = users
    .map((user) => {
      const socketID = userSocketIDs.get(user.toString());
      return socketID;
    })
  return sockets;
};


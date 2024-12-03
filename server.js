import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
  START_TYPING,
  STOP_TYPING,
  USER_OFFLINE,
  USER_ONLINE,
} from "./constants/events.js";
import { getSocketMembers } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { connectToDB } from "./utils/connectToDB.js";
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "./middlewares/socketAuth.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : undefined; // Use undefined in production
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export const userSocketIDs = new Map();
const onlineUsers = new Set();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer,{
    cors: {
      origin: dev
        ? "http://localhost:3000"
        : "https://convo-chat-app-rukc.onrender.com",
        
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  console.log("inside the server.js")
  connectToDB();
  io.use((socket, next) => {
    console.log("socketAuthenticator middleware check!")
    cookieParser()(socket.request, socket.request.res, async (err) => {
      console.log('inside cookie parser');
      await socketAuthenticator(err, socket, next);
    });
  });

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const user = socket.user;
    userSocketIDs.set(user.id.toString(), socket.id); // for every new connections
    console.log(userSocketIDs);
    onlineUsers.add(user.id.toString());
    io.emit(USER_ONLINE, Array.from(onlineUsers));
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user.id,
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      const messageForDB = {
        content: message,
        sender: user.id,
        chat: chatId,
      };

      const membersSockets = getSocketMembers(members);
      io.to(membersSockets).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime,
      });
      console.log(socket.id);
      io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });
      try {
        await Message.create(messageForDB);
      } catch (error) {
        console.log(error.message);
      }
    });
    socket.on(ALERT, ({ allMembers, message, chatId }) => {
      const membersSockets = getSocketMembers(allMembers);
      socket.to(membersSockets).emit(ALERT, { message, allMembers, chatId });
    });
    socket.on(START_TYPING, ({ members, chatId }) => {
      const membersSockets = getSocketMembers(members);
      socket.to(membersSockets).emit(START_TYPING, { chatId });
    });
    socket.on(STOP_TYPING, ({ members, chatId }) => {
      const membersSockets = getSocketMembers(members);
      socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });
    socket.on(NEW_ATTACHMENT, async ({ chatId, members, message }) => {
      const messageForRealTime = {
        content: "",
        attachments: message.attachments,
        _id: uuid(),
        sender: {
          _id: user.id,
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const membersSockets = getSocketMembers(members);

      console.log("members socket: ", membersSockets);
      io.to(membersSockets).emit(NEW_ATTACHMENT, {
        chatId,
        message: messageForRealTime,
      });
      io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });
    });
    socket.on(NEW_REQUEST, ({ userId }) => {
      const userSocket = getSocketMembers([userId]);
      // console.log("userId socket Id: ", userSocket);
      console.log("userSocket after emiting new", userSocket);
      io.to(userSocket).emit(NEW_REQUEST, { userId });
    });
    socket.on(REFETCH_CHATS, ({ members, chatId }) => {
      const membersSockets = getSocketMembers(members);
      console.log("members sockets", membersSockets);
      io.emit(REFETCH_CHATS, { members, chatId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      userSocketIDs.delete(user.id.toString());
      onlineUsers.delete(user.id.toString()); // Remove user from the set
      socket.broadcast.emit(USER_OFFLINE, Array.from(onlineUsers)); // Notify all clients about updated online users
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

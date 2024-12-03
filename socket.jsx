"use client"

import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { USER_OFFLINE, USER_ONLINE } from "./constants/events";
import useSocketEvents from "./hooks/useSocketEvents";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/reducers/chat";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  const onlineUsersHandler = useCallback((users) => {

    dispatch(setOnlineUsers(users));
  }, [
    dispatch, socket
  ]);
  const eventHandlers = {
    [USER_ONLINE]: onlineUsersHandler,
    [USER_OFFLINE]: onlineUsersHandler,
  }

  useSocketEvents(socket, eventHandlers);


  useEffect(() => {
    const socketURL = process.env.NODE_ENV === "production"
      ? "https://convo-chat-app-rukc.onrender.com" // Your production server URL
      : "http://localhost:3000"; // Local development URL
  
    const newSocket = io(socketURL, {
      transports: ["websocket", "polling"], // Use fallback transports for better reliability
      path: "/socket.io/", // Ensure the path matches the server configuration
    });
  
    newSocket.on("connect", () => {
      console.log("Connected to socket server with ID:", newSocket.id);
    });
  
    newSocket.on("connect_error", (err) => {
      console.log("Socket connection error:", err);
    });
  
    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  
    newSocket.on("reconnect", () => {
      console.log("Socket reconnected:", newSocket.id);
    });
  
    newSocket.on("reconnect_attempt", () => {
      console.log("Reconnecting...");
    });
  
    newSocket.on("reconnect_failed", () => {
      console.log("Reconnection failed");
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.close();
    };
  }, []);
  

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};


export { SocketProvider, getSocket }
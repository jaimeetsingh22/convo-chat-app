"use client"

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

 const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
 

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      // Add these options for reconnection
      reconnect: true,
      reconnectAttempts: Infinity,
      reconnectDelay: 1000,
      // Optionally, you can add reconnectDelayMax: 5000 to limit the maximum delay
    });

    newSocket.on("connect", () => {
      // console.log("Connected to socket server with ID:", newSocket.id);
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
  }, []); // Empty dependency array to ensure this effect runs only once

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};


export { SocketProvider, getSocket }
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { onMessageReadConfirmation, onNewNotification, onSocketConnect } from "../store/slices/notificationSlice";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const token = useSelector((state) => state.auth.token?.access_token);
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const newSocket = socketIO.connect(
      process.env.REACT_APP_API_ENDPOINT_URL,
      {
        auth: {
          token: token,
          userId: "USER_ID",
        },
      }
    );

    socketRef.current = newSocket;

        newSocket.on("connect", () => {
          console.log("Connected to websocket");
        });

        newSocket.on("disconnect", () => {
          console.log("Disconnected from websocket");
        });

        newSocket.on("getAllNotifications", (data) => {
          console.log("Socket messages", data);
          dispatch(onSocketConnect(data));
        });

        newSocket.on("notification", (data) => {
          console.log("Socket message", data);
          dispatch(onNewNotification(data));
        });
      
        newSocket.on("message-read-confirmed", (data) => {
          console.log("read Confirmed message", data);
          dispatch(onMessageReadConfirmation(data));
        });
      
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <WebSocketContext.Provider value={socketRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

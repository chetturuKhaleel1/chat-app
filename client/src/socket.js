import { io } from "socket.io-client";

const socket = io("https://chat-app-1-xd12.onrender.com", {
  withCredentials: true,
  transports: ["websocket"], // avoid xhr poll issues
});

export default socket;

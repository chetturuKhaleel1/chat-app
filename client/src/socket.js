import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"], // avoid xhr poll issues
});

export default socket;

import { io } from "socket.io-client";
//https://192.168.113.86:5000
export const socket = io("https://localhost:5000", {
  transports: ["websocket"],
});

import { io } from "socket.io-client";
//"https://192.168.0.164:5000"
export const socket = io("https://192.168.0.17:5000", {
  transports: ["websocket"],
});

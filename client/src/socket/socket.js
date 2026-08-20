import { io } from "socket.io-client";

console.log("Socket instance created");

export const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
    withCredentials: true,
});
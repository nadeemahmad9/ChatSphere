import {io} from "socket.io-client";

console.log("Socket instance created");


export const socket = io("http://localhost:3000", {
    autoConnect: false,
    withCredentials: true,
});
import { Server } from "socket.io";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Stores: userId -> socketId
export const userSocketMap = new Map();

// Helper function
export const getReceiverSocketId = (userId) => {
    return userSocketMap.get(userId.toString());
};

let io;
export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    // Authentication Middleware
    io.use(async (socket, next) => {
        try {
            // Parse cookies
            const cookies = cookie.parse(
                socket.handshake.headers.cookie || ""
            );
            

            const token = cookies.token;

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            // Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return next(new Error("User not found"));
            }

            // Attach authenticated user to socket
            socket.user = user;

            next();
        } catch (error) {
                console.error("Socket Auth Error:", error.message);
            next(new Error("Authentication failed"));
        }
    });

    // io.on("connection", (socket) => {

    //         console.log("======================");

    //     console.log("User Connected:", socket.id);
    //         console.log("Transport:", socket.conn.transport.name);


    //         socket.on("disconnect", (reason) => {
    //     console.log("Disconnected:", socket.id);
    //             console.log("Reason:", reason);

    // });

    // });

   io.on("connection", async (socket) => {

    const userId = socket.user._id.toString();

    // Save online user
    userSocketMap.set(userId, socket.id);

    // Update database
    await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: null,
    });

    // Notify frontend
    io.emit(
        "onlineUsers",
        Array.from(userSocketMap.keys())
    );

    console.log("================================");
    console.log(`${socket.user.name} Connected`);
    console.log("Socket ID:", socket.id);
    console.log("Online Users:", userSocketMap.size);
    console.log("================================");


    socket.conn.on("upgrade", () => {
        console.log("Upgraded:", socket.conn.transport.name);

    });

    // Typing indicator
socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", {
            senderId: socket.user._id.toString(),
        });
    }
});

// Stop typing
socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", {
            senderId: socket.user._id.toString(),
        });
    }
});

   

    socket.on("disconnect", async (reason) => {
    const userId = socket.user._id.toString();

    // Check karo ki disconnect hone wala socket
    // abhi bhi user's active socket hai ya nahi
    const currentSocketId = userSocketMap.get(userId);

   if (currentSocketId === socket.id) {
    userSocketMap.delete(userId);

    const lastSeen = new Date();

    await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen,
    });

    // Notify all clients
    io.emit("userOffline", {
        userId,
        lastSeen,
    });
}
    io.emit(
        "onlineUsers",
        Array.from(userSocketMap.keys())
    );

    console.log("================================");
    console.log(`${socket.user.name} Disconnected`);
    console.log("Socket ID:", socket.id);
    console.log("Reason:", reason);
    console.log("Online Users:", userSocketMap.size);
    console.log("================================");
});

});

    
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }

    return io;
};
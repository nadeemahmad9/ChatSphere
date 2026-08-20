// import "dotenv/config";
// import express from 'express'
// import connectDB from './config/db.js';
// import authRoutes from "./routes/authRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import cookieParser from 'cookie-parser';
// import http from "http";
// // import { Server } from 'socket.io';
// import { initializeSocket } from './socket/socket.js';
// import cors from 'cors';
// import cloudinary from "./config/cloudinary.js";
// import upload from "./middleware/uploadMiddleware.js";

// // dotenv.config();

// await connectDB();

// const app = express();
// // HTTP Server
// const server = http.createServer(app);

// // Initialize Socket.IO
// initializeSocket(server);

// // const io = new Server(server, {
// //   cors: {
// //     origin: "http://localhost:5173",
// //     credentials: true,
// //   },
// // });

// // io.on("connection", (socket) =>{
// //     //  socket.on("hello", (data) => {

// //     //     console.log(data);

// //     // });
// //     socket.emit("welcome", "Welcome to ChatSphere");
    
    
// // });

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(cookieParser())
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// app.get("/", (req,res)=>{
//     res.send("Server is Running...")
// });
// app.use("/api/auth", authRoutes)
// app.use("/api/message", messageRoutes)

// app.get("/test-cloudinary", async (req, res) => {
//     try {
//         const result = await cloudinary.api.ping();

//         return res.status(200).json({
//             success: true,
//             result,
//         });
//     } catch (error) {
//         console.error("Cloudinary Ping Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//             http_code: error.http_code,
//         });
//     }
// });

// app.post("/test-cloudinary-upload", upload.single("image"), async (req, res) => {
//     try {
//         console.log("TEST FILE:", req.file);

//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No file received",
//             });
//         }

// const result = await new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//         {
//             folder: "chatsphere/test",
//         },
//         (error, result) => {
//             console.log("========== CLOUDINARY CALLBACK ==========");

//             if (error) {
//                 console.dir(error, { depth: null });

//                 console.log("HTTP CODE:", error.http_code);
//                 console.log("ERROR MESSAGE:", error.message);
//                 console.log("ERROR NAME:", error.name);
                
//                 reject(error);
//             } else {
//                 console.log("UPLOAD SUCCESS:", result);
//                 resolve(result);
//             }

//             console.log("=========================================");
//         }
//     );

//     uploadStream.end(req.file.buffer);
// });

//         return res.json({
//             success: true,
//             url: result.secure_url,
//         });

//     } catch (error) {
//         console.error("TEST UPLOAD ERROR:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//             http_code: error.http_code,
//         });
//     }
// });



// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import http from "http";
import { initializeSocket } from "./socket/socket.js";
import cors from "cors";

// =========================
// Database
// =========================
await connectDB();

// =========================
// Express App
// =========================
const app = express();

// =========================
// HTTP Server
// =========================
const server = http.createServer(app);

// =========================
// Socket.IO
// =========================
initializeSocket(server);

// =========================
// Middleware
// =========================
app.use(
    cors({
        origin: "https://chat-lynk.netlify.app",
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

// =========================
// Port
// =========================
const PORT = process.env.PORT || 3000;

// =========================
// Basic Route
// =========================
app.get("/", (req, res) => {
    res.send("Server is Running...");
});

// =========================
// API Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// =========================
// Start Server
// =========================
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
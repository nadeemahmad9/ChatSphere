import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../models/User.js'


export const socketAuth = async (socket, next)=>{
    try {

         // Step 1: Read cookies
         const cookieHeader = socket.handshake.headers.cookie;
         console.log("Cookie Header:", cookieHeader);

        // Step 2: Get token

        // Step 3: Verify JWT

        // Step 4: Find user

        // Step 5: Attach user to socket 


        next()
    } catch (error) {
        next(new Error("Unauthorized"))
    }
}
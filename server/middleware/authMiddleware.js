import jwt from 'jsonwebtoken'
import User from '../models/User.js';

export const protect = async(req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success:false,
            message: "Unauthorized"
        });
    }
       const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");
        req.user = user;

        if (!user) {
    return res.status(401).json({
        success: false,
        message: "User not found",
    });
}
return next();

  } catch (error) {
    console.error("Protect Middleware:", error.message);
     return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
  }
}

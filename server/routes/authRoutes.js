import express from 'express'
import { getCurrentUser, getUsersForSidebar, loginUser, logoutUser, registerUser, updateProfile, updateProfilePicture } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/me",protect, getCurrentUser);
router.get("/users", protect, getUsersForSidebar);
router.put("/profile", protect, updateProfile)
router.put("/profile/picture", protect, upload.single("profilePic"),
updateProfilePicture
)
export default router;
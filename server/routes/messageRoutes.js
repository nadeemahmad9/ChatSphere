import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { deleteMessageForEveryone, deleteMessageForMe, markMessagesAsSeen, reactToMessage, sendMessage } from '../controllers/messageController.js';
import { getMessages } from '../controllers/authController.js';


const router = express.Router();

router.post("/:id", protect, sendMessage)
router.get("/:id", protect, getMessages)
router.patch("/seen/:id", protect, markMessagesAsSeen)
router.delete("/delete/:id", protect, deleteMessageForEveryone)
router.delete("/delete-for-me/:id", protect, deleteMessageForMe)
router.patch("/react/:id", protect, reactToMessage)


export default router;
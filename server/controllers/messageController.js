// import Message from "../models/Message.js";

// export const sendMessage = async (req, res) => {
//     try {

//         // 1. authenticated user
//         const senderId = req.user._id
//         // 2. receiverId + text
//         const {receiverId, text} = req.body;
//         // 3. validation

//         if (senderId.toString() === receiverId.toString()) {
//     return res.status(400).json({
//         success: false,
//         message: "You cannot send a message to yourself",
//     });
// }

// if (!text?.trim() && !image) {
//     return res.status(400).json({
//         success: false,
//         message: "Message cannot be empty",
//     });
// }
//         if (!receiverId || !text?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }
//         // 4. create message
// const message = await Message.create({
//     sender: senderId,
//     receiver: receiverId,
//     text: text.trim(),
// });

//         // 5. response
//         return res.status(201).json({
//     success: true,
//     message,
// });

//     } catch (error) {

//         // error response
//         console.error("Send Message Error:", error);

// return res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
// });

//     }
// };

// import Conversation from "../models/Conversation.js";
// import Message from "../models/Message.js";

// export const sendMessage = async (req, res) => {
//     try {
//         // 1. Authenticated user
//         const senderId = req.user._id;

//         // 2. Receiver ID URL se
//         const receiverId = req.params.id;

//         // 3. Message body
//         const { text } = req.body;

//         // console.log("Sender:", senderId);
//         // console.log("Receiver:", receiverId);
//         // console.log("Text:", text);

//         // 4. Validation
//         if (!receiverId || !text?.trim()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Receiver ID and message text are required",
//             });
//         }

//         // 5. Prevent self messaging
//         if (senderId.toString() === receiverId.toString()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "You cannot send a message to yourself",
//             });
//         }


//         //Find existing conversation
//         let conversation = await Conversation.findOne({
//             participants: {
//                 $all: [senderId, receiverId],
//             },
//         });

//         // Create conversation if it doesn't exist
//         if (!conversation) {
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId],
//                 messages: [],
//             });
//         }

//         // 6. Create message
//         const message = await Message.create({
//             sender: senderId,
//             receiver: receiverId,
//             text: text.trim(),
//         });

//         // Add message to conversation
//         conversation.messages.push(message._id);

//         await conversation.save();

//         // 7. Response
//         return res.status(201).json({
//             success: true,
//             message,
//         });

//     } catch (error) {
//         console.error("Send Message Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// };



import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        // 1. Authenticated user
        const senderId = req.user._id;

        // 2. Receiver ID from URL
        const receiverId = req.params.id;

        // 3. Message body
        const { text, replyTo } = req.body;

        // 4. Validation
        if (!receiverId || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID and message text are required",
            });
        }

        // 5. Prevent self messaging
        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a message to yourself",
            });
        }

        // =========================
        // 6. Validate reply message
        // =========================
        let replyMessage = null;

if (replyTo) {
            replyMessage =
                await Message.findById(replyTo);

            if (!replyMessage) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Reply message not found",
                });
            }

            // Reply message must belong
            // to this conversation
            const isPartOfConversation =
                (
                    replyMessage.sender.toString() ===
                        senderId.toString() &&
                    replyMessage.receiver.toString() ===
                        receiverId.toString()
                ) ||
                (
                    replyMessage.sender.toString() ===
                        receiverId.toString() &&
                    replyMessage.receiver.toString() ===
                        senderId.toString()
                );

            if (!isPartOfConversation) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You cannot reply to this message",
                });
            }
        }
       
            

        // 6. Find existing conversation
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
            },
        });

        // 7. Create conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [],
            });
        }

        // 8. Create message
        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            text: text.trim(),
                replyTo: replyTo || null,

        });

        // 9. Add message to conversation
        conversation.messages.push(message._id);

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    // =========================
        // 11. Populate reply
        // =========================
        await message.populate({
    path: "replyTo",
    select: "sender receiver text image createdAt",
    populate: [
        {
            path: "sender",
            select: "name profilePic",
        },
        {
            path: "receiver",
            select: "name profilePic",
        },
    ],
});
console.log("REPLY AFTER REFRESH:", message.replyTo);
     // =========================
        // 10. Socket Information
        // =========================
        const messageForSocket = {
            ...message.toObject(),

            senderUser: {
                _id: req.user._id,
                name: req.user.name,
                profilePic: req.user.profilePic,
            },
        };

        // 10. Get receiver socket
        const io = getIO();
        const receiverSocketId = getReceiverSocketId(receiverId);


        // 11. Send real-time message
        if (receiverSocketId) {
            console.log(
                "Emitting newMessage to:",
                receiverSocketId
            );

            io.to(receiverSocketId).emit(
                "newMessage",
                messageForSocket
            );
        }

        // 12. Response to sender
        return res.status(201).json({
            success: true,
             message: messageForSocket,
        });

    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Mark messages as seen
export const markMessagesAsSeen = async (req, res) =>{
    try {
        // Logged-in User = receiver
        const receiverId = req.user._id

        // The user whose messages we are reading 
        const senderId = req.params.id;

        // console.log("========== MARK SEEN ==========");
        // console.log("Sender ID:", senderId);
        // console.log("Receiver ID:", receiverId);

        // Find unread messages sent by sender to current user
        const result = await Message.updateMany(
            {
                sender: senderId,
                receiver: receiverId,
                seen: false,
            },
            {
                $set:{
                    seen: true,
                },
            }
        );

        // =========================
// Notify sender in real-time
// =========================
const io = getIO();

const senderSocketId = getReceiverSocketId(senderId);

if (senderSocketId && result.modifiedCount > 0) {
    io.to(senderSocketId).emit("messagesSeen", {
        senderId: senderId.toString(),
        receiverId: receiverId.toString(),
    });
}

        // console.log("Modified Count:", result.modifiedCount);
        // console.log("Matched Count:", result.matchedCount);
        // console.log("===============================");

        return res.status(200).json({
            success: true,
            message: "Messages marked as seen",
            modifiedCount: result.modifiedCount,
        })

    } catch (error) {
        console.error("Mark Messages Seen Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
        
        
    }
}

// Delete message for everyone
export const deleteMessageForEveryone = async (req, res) => {
    try {
        // =========================
        // 1. Logged-in user
        // =========================
        const userId = req.user._id;

        // =========================
        // 2. Message ID
        // =========================
        const messageId = req.params.id;

        if (!messageId) {
            return res.status(400).json({
                success: false,
                message: "Message ID is required",
            });
        }

        // =========================
        // 3. Find message
        // =========================
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        // =========================
        // 4. Only sender can delete
        // =========================
        if (
            message.sender.toString() !==
            userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own messages",
            });
        }

        // =========================
        // 5. Already deleted
        // =========================
        if (message.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Message is already deleted",
            });
        }

        // =========================
        // 6. Mark as deleted
        // =========================
        message.isDeleted = true;
        message.deletedAt = new Date();

        // Optional:
        // Remove actual message content
        message.text = "";
        message.image = "";

        await message.save();

        // =========================
        // 7. Notify both users
        // =========================
        const io = getIO();

        const senderSocketId =
            getReceiverSocketId(
                message.sender.toString()
            );

        const receiverSocketId =
            getReceiverSocketId(
                message.receiver.toString()
            );

       const deletePayload = {
    messageId: message._id.toString(),
    senderId: message.sender.toString(),
    receiverId: message.receiver.toString(),
};

        // Notify sender
        if (senderSocketId) {
            io.to(senderSocketId).emit(
                "messageDeleted",
                deletePayload
            );
        }

        // Notify receiver
        if (
            receiverSocketId &&
            receiverSocketId !== senderSocketId
        ) {
            io.to(receiverSocketId).emit(
                "messageDeleted",
                deletePayload
            );
        }

        // =========================
        // 8. Response
        // =========================
        return res.status(200).json({
            success: true,
            message: "Message deleted for everyone",
            deletedMessage: message,
        });

    } catch (error) {
        console.error(
            "Delete Message Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Delete message for me
export const deleteMessageForMe = async (req, res) => {
    try {
        const userId = req.user._id;
        const messageId = req.params.id;

                console.log("========== DELETE FOR ME ==========");
        console.log("Message ID:", messageId);
        console.log("Current User ID:", userId.toString());

        if (!messageId) {
            return res.status(400).json({
                success: false,
                message: "Message ID is required",
            });
        }

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        // User must be part of this conversation
        const isParticipant =
            message.sender.toString() === userId.toString() ||
            message.receiver.toString() === userId.toString();

                    console.log("Is Participant:", isParticipant);


        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete this message",
            });
        }

        // Already deleted for this user

        const deletedFor = message.deletedFor || [];

console.log(
    "Deleted For:",
    deletedFor.map((id) => id.toString())
);

       const alreadyDeletedForMe = message.deletedFor?.some(
    (id) => id.toString() === userId.toString()
);

console.log(
    "Already Deleted For Me:",
    alreadyDeletedForMe
);

if (alreadyDeletedForMe) {
    return res.status(200).json({
        success: false,
        message: "Message already deleted for you",
        messageId: message._id,
    });
}

        // Add current user
        message.deletedFor.push(userId);

        await message.save();

        return res.status(200).json({
            success: true,
            message: "Message deleted for you",
            messageId: message._id,
        });

    } catch (error) {
        console.error(
            "Delete Message For Me Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//reactToMessage
export const reactToMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        const messageId = req.params.id;
        const { emoji } = req.body;

        console.log("========== REACT TO MESSAGE ==========");
        console.log("Message ID:", messageId);
        console.log("User ID:", userId);
        console.log("Emoji:", emoji);

        // =========================
        // 1. Validation
        // =========================
        if (!messageId || !emoji) {
            return res.status(400).json({
                success: false,
                message: "Message ID and emoji are required",
            });
        }

        // =========================
        // 2. Find message
        // =========================
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        // =========================
        // 3. Prevent reaction on
        // deleted message
        // =========================
        if (message.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Cannot react to a deleted message",
            });
        }

        // =========================
        // 4. User must be participant
        // =========================
        const isParticipant =
            message.sender.toString() === userId.toString() ||
            message.receiver.toString() === userId.toString();

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "You cannot react to this message",
            });
        }

        // =========================
        // 5. Find user's reaction
        // =========================
        // =========================
// 5. Find user's same emoji reaction
// =========================
const existingReaction = message.reactions.find(
    (reaction) =>
        reaction.user.toString() === userId.toString() &&
        reaction.emoji === emoji
);

// =========================
// 6. Same emoji → remove
// =========================
if (existingReaction) {
    message.reactions = message.reactions.filter(
        (reaction) =>
            !(
                reaction.user.toString() === userId.toString() &&
                reaction.emoji === emoji
            )
    );
}

// =========================
// 7. New emoji → add
// =========================
else {
    message.reactions.push({
        user: userId,
        emoji,
    });
}

        await message.save();

await message.populate({
    path: "reactions.user",
    select: "name profilePic",
});

console.log(
    "========== FINAL REACTIONS =========="
);

console.log(
    message.reactions.map((reaction) => ({
        user: reaction.user?._id,
        name: reaction.user?.name,
        emoji: reaction.emoji,
    }))
);

        // =========================
// Real-time reaction update
// =========================
const io = getIO();

// Current user ka socket
const senderSocketId =
    getReceiverSocketId(userId.toString());

// Dusre user ka ID
const receiverId =
    message.sender.toString() === userId.toString()
        ? message.receiver.toString()
        : message.sender.toString();

// Dusre user ka socket
const receiverSocketId =
    getReceiverSocketId(receiverId);

const reactionData = {
    messageId: message._id,
    reactions: message.reactions,
};

// =========================
// Send reaction to receiver
// =========================
if (receiverSocketId) {
    console.log(
        "Emitting reaction update to receiver:",
        receiverSocketId
    );

    io.to(receiverSocketId).emit(
        "messageReactionUpdated",
        reactionData
    );
}

// =========================
// Send reaction to current user
// =========================
if (
    senderSocketId &&
    senderSocketId !== receiverSocketId
) {
    console.log(
        "Emitting reaction update to sender:",
        senderSocketId
    );

    io.to(senderSocketId).emit(
        "messageReactionUpdated",
        reactionData
    );
}

        // =========================
        // 10. Response
        // =========================
        return res.status(200).json({
            success: true,
            message: "Reaction updated",
            messageData: message,
        });

    } catch (error) {
        console.error(
            "React To Message Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


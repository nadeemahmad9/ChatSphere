import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from 'jsonwebtoken'
import Conversation from "../models/Conversation.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";
import Message from "../models/Message.js";
import cloudinary from "../config/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic empty fields validation
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Email format validation (using validator package)
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // 3. Password length validation (Minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 4. Email Normalization
    const normalizedEmail = email.toLowerCase().trim();

    // 5. Check Existing User
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 6. Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Create User in DB
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 8. Success Response
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

//Login Controller
export const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body;

        //Validation
        if (!email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            })
        }

        if (!validator.isEmail(email)) {
    return res.status(400).json({
        success:false,
        message:"Please enter a valid email"
    });
}


        const normalizedEmail = email.toLowerCase().trim();
        //Find User
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        //Compare Password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        //Generate JWT
        const token = jwt.sign(
            {
              id: user._id,  
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, {
  httpOnly: true,
      secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

return res.status(200).json({
  success: true,
  message: "Login Successful",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

    


// res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
// });

// return res.status(200).json({
//     success: true,
//     message: "Logout Successful",
// });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const getCurrentUser = (req,res)=>{

    return res.status(200).json({
        success:true,
        user:req.user
    })

}

export const logoutUser = async (req, res)=>{
 try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// export const sendMessage = async (req, res) => {
//     try {

//         const senderId = req.user._id;

//         const receiverId = req.params.id;

//          console.log("Sender ID:", senderId);
//         console.log("Receiver ID:", receiverId);

//         const { text, image } = req.body;

//         //logic...

//          if (!text?.trim() && !image) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Message cannot be empty",
//             });
//         }

//         let conversation = await Conversation.findOne({
//           participants:{
//             $all: [senderId, receiverId],
//           }
//         })

//         if (!conversation) {
//           conversation = await Conversation.create({
//             participants:[senderId, receiverId],
//           })
//         }

//         const newMessage = new Message({
//           sender: senderId,
//           receiver: receiverId,
//           text,
//           image,
//         })

//         conversation.messages.push(newMessage._id);

//         await Promise.all([
//           newMessage.save(),
//           conversation.save(),
//         ])


//         const io = getIO();
//         const receiverSocketId = getReceiverSocketId(receiverId);

// if (receiverSocketId) {
//     io.to(receiverSocketId).emit(
//         "newMessage",
//         newMessage
//     );
// }
// return res.status(201).json({
//     success: true,
//     message: newMessage,
// });

//     } catch (error) {
// console.error("Send Message Error:", error.message);

//     return res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//     });
// }
// };


// export const sendMessage = async (req, res) => {
//     try {
//         const senderId = req.user?._id;
//         const receiverId = req.params?.id;

//         console.log("========== SEND MESSAGE ==========");
//         console.log("Sender ID:", senderId);
//         console.log("Receiver ID:", receiverId);
//         console.log("==================================");

//         const { text, image } = req.body;

//         if (!senderId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Sender not found",
//             });
//         }

//         if (!receiverId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Receiver ID is required",
//             });
//         }

//         if (senderId.toString() === receiverId.toString()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "You cannot send a message to yourself",
//             });
//         }

//         if (!text?.trim() && !image) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Message cannot be empty",
//             });
//         }

//         let conversation = await Conversation.findOne({
//             participants: {
//                 $all: [senderId, receiverId],
//             },
//         });

//         if (!conversation) {
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId],
//             });
//         }

//         const newMessage = new Message({
//             sender: senderId,
//             receiver: receiverId,
//             text: text?.trim() || "",
//             image: image || "",
//         });

//         conversation.messages.push(newMessage._id);

//         await Promise.all([
//             newMessage.save(),
//             conversation.save(),
//         ]);

//         const io = getIO();
//         const receiverSocketId = getReceiverSocketId(receiverId);

//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit(
//                 "newMessage",
//                 newMessage
//             );
//         }

//         return res.status(201).json({
//             success: true,
//             message: newMessage,
//         });

//     } catch (error) {
//         console.error("Send Message Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// };

export const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const receiverId = req.params.id;

       const conversation = await Conversation.findOne({
    participants: {
        $all: [userId, receiverId],
    },
}).populate({
    path: "messages",
    populate: [
        {
            path: "replyTo",
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
        },
        {
            path: "sender",
            select: "name profilePic",
        },
        {
            path: "receiver",
            select: "name profilePic",
        },
        {
            path: "reactions.user",
            select: "name profilePic",
        },
    ],
});

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: [],
            });
        }

        // =========================
        // Remove messages deleted
        // for current user
        // =========================
        const visibleMessages = conversation.messages.filter(
            (message) => {
                const deletedFor = message.deletedFor || [];

                return !deletedFor.some(
                    (id) =>
                        id.toString() === userId.toString()
                );
            }
        );

        return res.status(200).json({
            success: true,
            messages: visibleMessages,
        });

    } catch (error) {
        console.error(
            "Get Messages Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// export const getUsersForSidebar = async (req, res) => {
//     try {
//         const userId = req.user._id;

//         const filteredUsers = await User.find({
//             _id: {
//                 $ne: userId,
//             },
//         }).select("-password");

//         const usersWithLastMessage = await Promise.all(
            
//             filteredUsers.map(async (user) => {
//                 const conversation = await Conversation.findOne({
//                     participants: {
//                         $all: [userId, user._id],
//                     },
//                 }).populate({
//                     path: "lastMessage",
//                     select: "text sender receiver createdAt seen",
//                 });

//                 return {
//                     ...user.toObject(),

//                     lastMessage:
//                         conversation?.lastMessage || null,

//                     lastMessageAt:
//                         conversation?.lastMessageAt || null,
//                 };
//             })
//         );


//          // =========================
//         // Sort by latest message
//         // =========================
//         usersWithLastMessage.sort((a, b) => {

//             // Users without messages → bottom
//             if (!a.lastMessageAt) return 1;
//             if (!b.lastMessageAt) return -1;

//             // Latest message → top
//             return (
//                 new Date(b.lastMessageAt) -
//                 new Date(a.lastMessageAt)
//             );
//         });

//         return res.status(200).json({
//             success: true,
//             users: usersWithLastMessage,
//         });

//     } catch (error) {
//         console.error("Get Users Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// };


//Aggregation version:
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const users = await User.aggregate([
            // =========================
            // 1. Current user ko exclude
            // =========================
            {
                $match: {
                    _id: { $ne: userId },
                },
            },

            // =========================
            // 2. Conversation find
            // =========================
            {
                $lookup: {
                    from: "conversations",
                    let: {
                        otherUserId: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                userId,
                                                "$participants",
                                            ],
                                        },
                                        {
                                            $in: [
                                                "$$otherUserId",
                                                "$participants",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "conversation",
                },
            },

            // =========================
            // 3. Conversation array → object
            // =========================
            {
                $unwind: {
                    path: "$conversation",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
    $lookup: {
        from: "messages",
        let: {
            senderId: "$_id",
        },
        pipeline: [
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    "$sender",
                                    "$$senderId",
                                ],
                            },
                            {
                                $eq: [
                                    "$receiver",
                                    userId,
                                ],
                            },
                            {
                                $eq: [
                                    "$seen",
                                    false,
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $count: "count",
            },
        ],
        as: "unreadMessages",
    },
},

{
    $addFields: {
        unreadCount: {
            $ifNull: [
                {
                    $arrayElemAt: [
                        "$unreadMessages.count",
                        0,
                    ],
                },
                0,
            ],
        },
    },
},
            // =========================
            // 4. Latest message lookup
            // =========================
            {
                $lookup: {
                    from: "messages",
                    localField: "conversation.lastMessage",
                    foreignField: "_id",
                    as: "lastMessage",
                },
            },

            // =========================
            // 5. Message array → object
            // =========================
            {
                $unwind: {
                    path: "$lastMessage",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // =========================
            // 6. Required fields
            // =========================
            {
                $project: {
                
                    name: 1,
                    email: 1,
                    profilePic: 1,
                    bio: 1,
                    isOnline: 1,
                    lastSeen: 1,
                    createdAt: 1,
                    updatedAt: 1,

                    lastMessage: {
                        $cond: [
                            {
                                $ifNull: [
                                    "$lastMessage._id",
                                    false,
                                ],
                            },
                            {
                                _id: "$lastMessage._id",
                                sender: "$lastMessage.sender",
                                receiver: "$lastMessage.receiver",
                                text: "$lastMessage.text",
                                seen: "$lastMessage.seen",
                                createdAt: "$lastMessage.createdAt",
                            },
                            null,
                        ],
                    },

                    lastMessageAt:
                        "$conversation.lastMessageAt",
                        unreadCount: 1,

                },
            },

            // =========================
            // 7. Latest chat → TOP
            // =========================
            {
                $sort: {
                    lastMessageAt: -1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            users,
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//Edit Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, bio } = req.body;

        // Validation
        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: name.trim(),
                bio: bio?.trim() || "",
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;

        // Check image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required",
            });
        }

        // Upload image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "chatsphere/profile-pictures",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(req.file.buffer);
        });

        // Update profile picture URL in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: result.secure_url,
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile Picture Error:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
        });

        return res.status(500).json({
            success: false,
            message: "Failed to upload profile picture",
        });
    }
};


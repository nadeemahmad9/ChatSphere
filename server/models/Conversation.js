import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    //Latest message
    lastMessage:{
      type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
    },
     // Latest message time
        lastMessageAt: {
            type: Date,
            default: null,
        },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;
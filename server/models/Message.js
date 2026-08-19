import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    seen: {
      type: Boolean,
      default: false,
    },
    // =========================
    // Delete for Everyone
    // =========================
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    // =========================
        // Reply To
        // =========================
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
        
    // =========================
    // Delete for me
    // =========================
    deletedFor: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
],

reactions: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        emoji: {
            type: String,
            required: true,
        },
    },
],

  },
  
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
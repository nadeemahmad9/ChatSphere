import { Smile, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { socket } from "../../socket/socket";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const {
        selectedUser,
        sendMessage,
        sendingMessage,
        replyingTo,
        setReplyingTo,
        inputRef,
    } = useChat();

    const typingTimeoutRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // =========================
    // Send Message
    // =========================
    const handleSendMessage = async () => {
        if (!selectedUser?._id) return;
        if (!message.trim()) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        socket.emit("stopTyping", {
            receiverId: selectedUser._id,
        });

        const messageText = message.trim();

        // Input immediately clear
        setMessage("");

        const data = await sendMessage(selectedUser._id, {
            text: messageText,
        });

        // API failed → message recover
        if (!data?.success) {
            setMessage(messageText);
            return;
        }

        // =========================
        // Reply preview close
        // =========================
        setReplyingTo(null);
    };

    // =========================
    // Enter Key
    // =========================
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // =========================
    // Typing
    // =========================
    const handleChange = (e) => {
        const value = e.target.value;

        setMessage(value);

        if (!selectedUser?._id) return;

        // Empty input
        if (!value.trim()) {
            socket.emit("stopTyping", {
                receiverId: selectedUser._id,
            });

            return;
        }

        // User started typing
        socket.emit("typing", {
            receiverId: selectedUser._id,
        });

        // Clear previous timer
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 1 second
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", {
                receiverId: selectedUser._id,
            });

            typingTimeoutRef.current = null;
        }, 1000);
    };

    // =========================
    // Emoji
    // =========================
    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    // =========================
    // Cleanup
    // =========================
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            if (selectedUser?._id) {
                socket.emit("stopTyping", {
                    receiverId: selectedUser._id,
                });
            }
        };
    }, [selectedUser]);

    // =========================
    // Outside Click
    // =========================
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [showEmojiPicker]);

    // =========================
    // Picker close when chat changes
    // =========================
    useEffect(() => {
        setShowEmojiPicker(false);
    }, [selectedUser]);

    return (
        <footer className="shrink-0 border-t border-slate-800/80 bg-slate-900">
            {/* =========================
                Reply Preview
            ========================= */}
            {replyingTo && (
                <div className="flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/70 px-3 py-2 sm:px-4">
                    {/* Reply Indicator */}
                    <div className="h-10 w-1 shrink-0 rounded-full bg-emerald-500" />

                    {/* Replied Message */}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-emerald-400">
                            {replyingTo.sender === selectedUser?._id
                                ? selectedUser?.name || "User"
                                : "You"}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
                            {replyingTo.text?.trim() || "Message"}
                        </p>
                    </div>

                    {/* Close Reply */}
                    <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white active:scale-95"
                        aria-label="Cancel reply"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* =========================
                Input Row
            ========================= */}
            <div className="flex items-center gap-1.5 px-2 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
                {/* Emoji Button */}
                <div ref={emojiPickerRef} className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() =>
                            setShowEmojiPicker((prev) => !prev)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-yellow-400 active:scale-95 sm:h-11 sm:w-11"
                        aria-label="Emoji"
                    >
                        <Smile size={21} />
                    </button>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div className="absolute bottom-12 left-0 z-50 overflow-hidden rounded-xl shadow-2xl shadow-black/40 sm:bottom-14">
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                theme="dark"
                                width="min(320px, calc(100vw - 1rem))"
                                height={400}
                            />
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={!selectedUser || sendingMessage}
                    placeholder={
                        replyingTo
                            ? "Reply to message..."
                            : "Type a message..."
                    }
                    className="min-w-0 flex-1 rounded-full border border-slate-700/80 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-slate-600 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3 sm:text-sm"
                />

                {/* Send Button */}
                <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={
                        !selectedUser ||
                        !message.trim() ||
                        sendingMessage
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition-all duration-200 hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-600 disabled:active:scale-100 sm:h-11 sm:w-11"
                    aria-label="Send message"
                >
                    <SendHorizontal size={19} />
                </button>
            </div>
        </footer>
    );
};

export default MessageInput;
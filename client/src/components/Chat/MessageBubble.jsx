import React, { useContext, useEffect, useRef, useState } from "react";
import { Check, CheckCheck, MoreVertical, Trash2, X, Heart } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const MessageBubble = ({ message, onReplyClick, highlighted }) => {
    const { user } = useContext(AuthContext);

    const {
        deleteMessageForEveryone,
        deleteMessageForMe,
        setReplyingTo,
        selectedUser,
        focusMessageInput,
        reactToMessage,
    } = useChat();

    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showReactionDetails, setShowReactionDetails] = useState(false);
    const [selectedReactionEmoji, setSelectedReactionEmoji] = useState(null);


    const menuRef = useRef(null);
    const reactionRef = useRef(null);

    const reactions = ["❤️", "👍", "😂", "😮", "😢"];

    const senderId =
        typeof message.sender === "object"
            ? message.sender?._id
            : message.sender;

    const isOwnMessage =
        String(senderId) === String(user?._id);

    const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    // =========================
    // Close menu outside click
    // =========================
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
                setShowReactionPicker(false);
                setShowReactionDetails(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // =========================
    // Delete Message
    // =========================
    const handleDelete = async () => {
        try {
            setDeleting(true);

            const data = await deleteMessageForEveryone(message._id);

            if (!data.success) {
                console.error("Delete Message Error:", data.message);
                return;
            }

            setShowDeleteConfirm(false);
            setShowMenu(false);
        } catch (error) {
            console.error("Delete Message Error:", error);
        } finally {
            setDeleting(false);
        }
    };

    // =========================
    // Delete For Me
    // =========================
    const handleDeleteForMe = async () => {
        console.log("Deleting message for me:", message._id);

        setShowMenu(false);

        const data = await deleteMessageForMe(message._id);

        console.log("Delete for me result:", data);
    };

    // =========================
    // Reply
    // =========================
    const handleReply = () => {
        setReplyingTo(message);
        setShowMenu(false);
        focusMessageInput();
    };

    // =========================
    // React To Message
    // =========================
    const handleReaction = async (emoji) => {
        setShowReactionPicker(false);

        const data = await reactToMessage(message._id, emoji);

        if (!data.success) {
            console.error("Reaction failed:", data.message);
        }
    };

    const groupedReactions = (message.reactions || []).reduce(
        (groups, reaction) => {
            const emoji = reaction.emoji;

            if (!groups[emoji]) {
                groups[emoji] = [];
            }

            groups[emoji].push(reaction);

            return groups;
        },
        {}
    );

    return (
        <div id={`message-${message._id}`} className={`mb-2 flex w-full ${isOwnMessage ? "justify-end message-in-right" : "justify-start message-in-left"}`}>
            <div className={`group relative max-w-[88%] rounded-2xl px-3 py-2 shadow-sm sm:max-w-md sm:px-3.5 ${isOwnMessage ? "rounded-br-md bg-emerald-700 text-white" : "rounded-bl-md bg-slate-800 text-slate-100"} ${highlighted ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-950" : ""} ${message.isDeleted ? "bg-slate-800/70 text-slate-400" : ""}`}>

                {/* =========================
                    Deleted Message
                ========================= */}
                {message.isDeleted ? (
                    <div className="flex items-center gap-2">
                        <Trash2 size={14} className="shrink-0 text-slate-500" />

                        <p className="text-sm italic text-slate-400 sm:text-[15px]">
                            This message was deleted
                        </p>
                    </div>
                ) : (
                    <>
                        {/* =========================
                            Replied Message
                        ========================= */}
                        {message.replyTo && (
                            <button
                                type="button"
                                onClick={() => {
                                    const replyId =
                                        typeof message.replyTo === "object"
                                            ? message.replyTo._id
                                            : message.replyTo;

                                    onReplyClick?.(replyId);
                                }}
                                className="mb-2 flex w-full items-center gap-2 overflow-hidden rounded-lg border-l-4 border-emerald-400 bg-black/15 px-2.5 py-2 text-left transition-colors hover:bg-black/25"
                            >
                                {/* Reply Sender */}
                                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-700">
                                    {message.replyTo?.sender?.profilePic ? (
                                        <img
                                            src={message.replyTo.sender.profilePic}
                                            alt={message.replyTo.sender?.name || "User"}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                                            {message.replyTo?.sender?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>

                                {/* Reply Information */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-emerald-300">
                                        {String(message.replyTo?.sender?._id) === String(user?._id)
                                            ? "You"
                                            : message.replyTo?.sender?.name || "User"}
                                    </p>

                                    <p className="truncate text-xs text-slate-300">
                                        {message.replyTo?.text?.trim() || "Message"}
                                    </p>
                                </div>
                            </button>
                        )}

                        {/* =========================
                            Message Content
                        ========================= */}
                        <div className="flex items-start gap-1">
                            <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-[1.45] sm:text-[15px]">
                                {message.text}
                            </p>

                            {/* =========================
                                Message Actions
                            ========================= */}
                            <div ref={menuRef} className="relative -mr-1 flex shrink-0 items-start gap-0.5">
                                {/* Reaction Button */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowReactionPicker((prev) => !prev);
                                        }}
                                        className="flex h-6 w-6 items-center justify-center
    rounded-full
    text-white/50
    opacity-100
    transition-all duration-200
    hover:scale-110
    hover:bg-white/10
    hover:text-white
    sm:opacity-0
    sm:group-hover:opacity-100"
                                        aria-label="React to message"
                                    >
                                        <Heart size={14} />
                                    </button>

                                    {/* Reaction Picker */}
                                    {showReactionPicker && (
                                        <div className={`absolute top-7 z-[110] flex items-center gap-0.5 rounded-full border border-slate-700 bg-slate-900 px-1.5 py-1.5 shadow-2xl ${isOwnMessage ? "right-0" : "left-0"}`}>
                                            {reactions.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => {
                                                        handleReaction(emoji);
                                                        setShowReactionPicker(false);
                                                    }}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-transform hover:scale-125 hover:bg-slate-800"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* More Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReactionPicker(false);
                                        setShowMenu((prev) => !prev);
                                    }}
                                    className="flex h-6 w-6 items-center justify-center rounded-full text-white/50 opacity-100 transition-all hover:bg-white/10 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                                    aria-label="Message options"
                                >
                                    <MoreVertical size={15} />
                                </button>

                                {/* =========================
                                    Dropdown
                                ========================= */}
                                {showMenu && (
                                    <div className={`absolute top-7 z-[100] w-52 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-2xl shadow-black/30 ${isOwnMessage ? "right-0" : "left-0"}`}>
                                        {/* Reply */}
                                        <button
                                            type="button"
                                            onClick={handleReply}
                                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800"
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center text-base">
                                                ↩
                                            </span>

                                            <span>Reply</span>
                                        </button>

                                        {/* Delete For Me */}
                                        <button
                                            type="button"
                                            onClick={handleDeleteForMe}
                                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800"
                                        >
                                            <Trash2 size={16} />
                                            <span>Delete for me</span>
                                        </button>

                                        {/* Delete For Everyone */}
                                        {isOwnMessage && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowDeleteConfirm(true);
                                                }}
                                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-slate-800"
                                            >
                                                <Trash2 size={16} />
                                                <span>Delete for everyone</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* =========================
                            Message Reactions
                        ========================= */}
                        {Object.keys(groupedReactions).length > 0 && (
                            <div className="relative mt-1 flex flex-wrap gap-1">
                                {Object.entries(groupedReactions).map(
                                    ([emoji, reactionList]) => {

                                        const hasMyReaction = reactionList.some(
                                            (reaction) =>
                                                String(
                                                    reaction.user?._id ||
                                                    reaction.user
                                                ) === String(user?._id)
                                        );

                                        return (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedReactionEmoji(emoji);

                                                    setShowReactionDetails(true);
                                                }}
                                                className={`
                            flex
                            items-center
                            gap-1
                            rounded-full
                            border
                            px-2
                            py-0.5
                            text-sm
                            shadow
                            transition
                            hover:scale-105
                            ${hasMyReaction
                                                        ? "border-blue-400 bg-blue-500/20"
                                                        : "border-slate-600 bg-slate-900/80"
                                                    }
                        `}
                                            >
                                                <span>{emoji}</span>

                                                {reactionList.length > 1 && (
                                                    <span className="text-xs text-slate-300">
                                                        {reactionList.length}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    }
                                )}

                                {/* Reaction Details Popup */}
                                {showReactionDetails && (
                                    <div
                                        className={`
                    absolute
                    bottom-8
                    z-[120]
                    w-64
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    p-3
                    shadow-2xl
                    ${isOwnMessage
                                                ? "right-0"
                                                : "left-0"
                                            }
                `}
                                    >
                                        <p className="mb-3 text-sm font-semibold text-white">
                                            Reactions
                                        </p>

                                        <div className="max-h-48 space-y-2 overflow-y-auto">
                                            {message.reactions
                                                .filter(
                                                    (reaction) =>
                                                        reaction.emoji === selectedReactionEmoji
                                                )
                                                .map(
                                                    (reaction, index) => {

                                                        const reactionUser =
                                                            reaction.user?._id
                                                                ? reaction.user
                                                                : null;

                                                        return (
                                                            <div
                                                                key={
                                                                    reaction.user?._id ||
                                                                    reaction.user ||
                                                                    index
                                                                }
                                                                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-800"
                                                            >
                                                                {/* Profile */}
                                                                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-700">
                                                                    {reactionUser?.profilePic ? (
                                                                        <img
                                                                            src={
                                                                                reactionUser.profilePic
                                                                            }
                                                                            alt={
                                                                                reactionUser.name ||
                                                                                "User"
                                                                            }
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                                                                            {reactionUser?.name
                                                                                ?.charAt(0)
                                                                                ?.toUpperCase() ||
                                                                                "U"}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Name */}
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-sm font-medium text-white">
                                                                        {String(
                                                                            reactionUser?._id
                                                                        ) ===
                                                                            String(user?._id)
                                                                            ? "You"
                                                                            : reactionUser?.name ||
                                                                            "User"}
                                                                    </p>
                                                                </div>

                                                                {/* Emoji */}
                                                                <span className="text-lg">
                                                                    {reaction.emoji}
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* =========================
                            Time + Seen Status
                        ========================= */}
                        <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="text-[10px] text-white/55">
                                {messageTime}
                            </span>

                            {isOwnMessage &&
                                (message.seen ? (
                                    <CheckCheck size={15} strokeWidth={2.5} className="text-cyan-300" aria-label="Seen" />
                                ) : (
                                    <Check size={14} strokeWidth={2.5} className="text-white/60" aria-label="Sent" />
                                ))}
                        </div>
                    </>
                )}
            </div>

            {/* =========================
                Delete Confirmation
            ========================= */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl shadow-black/40">
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">
                                Delete message?
                            </h3>

                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-slate-400">
                            This message will be deleted for everyone in this chat.
                        </p>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete for everyone"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
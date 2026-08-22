import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import MessageBubble from "./MessageBubble";

const MessageList = () => {
    const {
        messages,
        loadingMessages,
        selectedUser,
        typingUser,
        markMessagesAsSeen,
        isSearchingMessages,
        messageSearchQuery,
        searchResults,
        searchResultIndex,
        setSearchResultIndex,
    } = useChat();

    const [showNewMessageButton, setShowNewMessageButton] =
        useState(false);

    const [highlightedMessageId, setHighlightedMessageId] =
        useState(null);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // =========================
    // Check near bottom
    // =========================
    const isNearBottom = () => {
        const container = messagesContainerRef.current;

        if (!container) return true;

        const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;

        return distanceFromBottom < 100;
    };

    // =========================
    // Handle scroll
    // =========================
    const handleScroll = () => {
        if (isNearBottom()) {
            setShowNewMessageButton(false);
        }
    };

    // =========================
    // Scroll to message
    // =========================
    const scrollToMessage = (messageId) => {
        const messageElement = document.getElementById(
            `message-${messageId}`
        );

        if (!messageElement) return;

        messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        messageElement.classList.add("message-highlight");

        setTimeout(() => {
            messageElement.classList.remove(
                "message-highlight"
            );
        }, 1500);
    };

    // =========================
    // Handle reply click
    // =========================
    const handleReplyClick = (messageId) => {
        const element = document.getElementById(
            `message-${messageId}`
        );

        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        setHighlightedMessageId(messageId);

        setTimeout(() => {
            setHighlightedMessageId(null);
        }, 2000);
    };


    const searchResults = messages.filter((message) => {
        if (!messageSearchQuery.trim()) {
            return false;
        }

        if (message.isDeleted) {
            return false;
        }

        return message.text
            ?.toLowerCase()
            .includes(messageSearchQuery.trim().toLowerCase());
    });

    const currentSearchMessage =
        searchResults[searchResultIndex] || null;


    //Previous / Next navigation
    const goToNextSearchResult = () => {
        if (searchResults.length === 0) {
            return;
        }

        setSearchResultIndex((prev) => {
            if (prev >= searchResults.length - 1) {
                return 0;
            }

            return prev + 1;
        });
    };

    const goToPreviousSearchResult = () => {
        if (searchResults.length === 0) {
            return;
        }

        setSearchResultIndex((prev) => {
            if (prev <= 0) {
                return searchResults.length - 1;
            }

            return prev - 1;
        });
    };
    // =========================
    // Auto scroll
    // =========================
    useEffect(() => {
        if (isNearBottom()) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });

            setShowNewMessageButton(false);
        } else {
            setShowNewMessageButton(true);
        }
    }, [messages, typingUser]);




    // =========================
    // Chat open → scroll to latest
    // =========================
    useEffect(() => {
        if (
            !loadingMessages &&
            selectedUser?._id &&
            messages.length > 0
        ) {
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "auto",
                });
            });

            setShowNewMessageButton(false);
        }
    }, [selectedUser?._id, loadingMessages]);

    // =========================
    // Mark messages as seen
    // =========================
    useEffect(() => {
        if (!selectedUser?._id) return;

        const hasUnreadMessages = messages.some(
            (message) =>
                message.sender === selectedUser._id &&
                !message.seen
        );

        if (hasUnreadMessages) {
            markMessagesAsSeen(selectedUser._id);
        }
    }, [selectedUser, messages]);


    // =========================
    // Navigate Search Result
    // =========================
    useEffect(() => {
        if (!isSearchingMessages) return;

        if (!messageSearchQuery.trim()) return;

        if (searchResults.length === 0) return;

        const currentMessage =
            searchResults[searchResultIndex];

        if (!currentMessage?._id) return;

        const messageElement = document.getElementById(
            `message-${currentMessage._id}`
        );

        if (!messageElement) return;

        messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        setHighlightedMessageId(currentMessage._id);

        const timer = setTimeout(() => {
            setHighlightedMessageId(null);
        }, 1500);

        return () => clearTimeout(timer);

    }, [
        isSearchingMessages,
        messageSearchQuery,
        searchResults,
        searchResultIndex,
    ]);
    // =========================
    // Scroll to bottom
    // =========================
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

        setShowNewMessageButton(false);
    };

    return (
        <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="
                relative
                min-h-0
                flex-1
                overflow-y-auto
                bg-slate-950
                text-white
                scrollbar-thin
                scrollbar-track-transparent
                scrollbar-thumb-slate-700/60
                hover:scrollbar-thumb-slate-600
            "
        >
            {/* =========================
                Loading State
            ========================= */}
            {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-slate-900/80
                            px-4
                            py-3
                            shadow-sm
                        "
                    >
                        <span
                            className="
                                h-1.5
                                w-1.5
                                animate-bounce
                                rounded-full
                                bg-emerald-400
                                [animation-delay:-0.3s]
                            "
                        />

                        <span
                            className="
                                h-1.5
                                w-1.5
                                animate-bounce
                                rounded-full
                                bg-emerald-400
                                [animation-delay:-0.15s]
                            "
                        />

                        <span
                            className="
                                h-1.5
                                w-1.5
                                animate-bounce
                                rounded-full
                                bg-emerald-400
                            "
                        />
                    </div>
                </div>

            ) : messages.length === 0 ? (

                /* =========================
                    Empty State
                ========================= */
                <div
                    className="
                        flex
                        h-full
                        items-center
                        justify-center
                        px-6
                    "
                >
                    <div
                        className="
                            max-w-sm
                            text-center
                        "
                    >
                        <div
                            className="
                                mx-auto
                                mb-4
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-slate-900
                                text-2xl
                                shadow-sm
                            "
                        >
                            💬
                        </div>

                        <h3
                            className="
                                text-sm
                                font-medium
                                text-slate-300
                                sm:text-base
                            "
                        >
                            No messages yet
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                sm:text-sm
                            "
                        >
                            Start a conversation with{" "}
                            <span className="text-slate-400">
                                {selectedUser?.name}
                            </span>{" "}
                            👋
                        </p>
                    </div>
                </div>

            ) : (

                /* =========================
                    Messages
                ========================= */
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-4xl
                        space-y-1
                        px-2
                        py-4
                        sm:px-4
                        sm:py-5
                        md:px-6
                    "
                >
                    {messages.map((message) => (
                        <MessageBubble
                            key={message._id}
                            message={message}
                            onReplyClick={handleReplyClick}
                            highlighted={
                                highlightedMessageId ===
                                message._id
                            }
                        />
                    ))}

                    {/* =========================
                        Typing Indicator
                    ========================= */}
                    {typingUser === selectedUser?._id && (
                        <div className="flex items-center gap-2 px-2 pb-2 pt-1">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    rounded-2xl
                                    rounded-bl-md
                                    bg-slate-800
                                    px-3
                                    py-2.5
                                "
                            >
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        animate-bounce
                                        rounded-full
                                        bg-slate-400
                                        [animation-delay:-0.3s]
                                    "
                                />

                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        animate-bounce
                                        rounded-full
                                        bg-slate-400
                                        [animation-delay:-0.15s]
                                    "
                                />

                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        animate-bounce
                                        rounded-full
                                        bg-slate-400
                                    "
                                />
                            </div>
                        </div>
                    )}

                    {/* =========================
                        Scroll Anchor
                    ========================= */}
                    <div
                        ref={messagesEndRef}
                        className="h-1"
                    />
                </div>
            )}

            {/* =========================
                New Messages Button
            ========================= */}
            {showNewMessageButton && (
                <button
                    type="button"
                    onClick={scrollToBottom}
                    className="
                        absolute
                        bottom-5
                        left-1/2
                        z-10
                        flex
                        -translate-x-1/2
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-slate-700
                        bg-slate-800
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-slate-200
                        shadow-xl
                        shadow-black/20
                        transition-all
                        duration-200
                        hover:bg-slate-700
                        hover:text-white
                        active:scale-95
                        sm:px-4
                        sm:text-sm
                    "
                >
                    <span className="text-base leading-none">
                        ↓
                    </span>

                    <span>
                        New messages
                    </span>
                </button>
            )}
        </div>
    );
};

export default MessageList;
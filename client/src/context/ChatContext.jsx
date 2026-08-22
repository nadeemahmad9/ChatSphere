
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { fetchMessages, markMessagesAsSeenApi, sendMessageApi, deleteMessageForEveryone as deleteMessageForEveryoneApi, deleteMessageForMe as deleteMessageForMeApi, reactToMessageApi, } from "../services/messageServices";
import { socket } from "../socket/socket";
import { fetchUsers } from "../services/userServices";
import { AuthContext } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(() => {
        const savedUser = localStorage.getItem("selectedUser");

        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const { isAuthenticated, user } = useContext(AuthContext);
    const [replyingTo, setReplyingTo] = useState(null);

    const [isSearchingMessages, setIsSearchingMessages] = useState(false);
    const [messageSearchQuery, setMessageSearchQuery] = useState("");
    const [searchResultIndex, setSearchResultIndex] = useState(0);

    const inputRef = useRef(null);

    const focusMessageInput = () => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const clearMessageSearch = () => {
        setIsSearchingMessages(false);
        setMessageSearchQuery("");
        setSearchResultIndex(0);
    };

    // =========================
    // Get Messages
    // =========================
    const getMessages = async (receiverId) => {
        try {
            setLoadingMessages(true);

            const data = await fetchMessages(receiverId);

            if (data.success) {
                setMessages(data.messages);
            } else {
                setMessages([]);
            }

        } catch (error) {
            console.error("Get Messages Error:", error);
            setMessages([]);

        } finally {
            setLoadingMessages(false);
        }
    };
    // =========================
    // Send Message
    // =========================
    const sendMessage = async (receiverId, messageData) => {
        try {
            setSendingMessage(true);

            const data = await sendMessageApi(
                receiverId,
                {
                    ...messageData,
                    replyTo: replyingTo?._id || null,
                }
            );

            if (data.success) {

                // =========================
                // 1. Add message to chat
                // =========================
                setMessages((prevMessages) => {

                    const alreadyExists = prevMessages.some(
                        (message) =>
                            message._id === data.message._id
                    );

                    if (alreadyExists) {
                        return prevMessages;
                    }

                    return [
                        ...prevMessages,
                        data.message,
                    ];
                });

                // =========================
                // 2. Update Sidebar
                // =========================
                setUsers((prevUsers) => {

                    const updatedUser = prevUsers.find(
                        (user) =>
                            user._id === receiverId
                    );

                    if (!updatedUser) {
                        return prevUsers;
                    }

                    const updatedUserData = {
                        ...updatedUser,
                        lastMessage: data.message,
                        lastMessageAt:
                            data.message.createdAt,
                    };

                    const filteredUsers =
                        prevUsers.filter(
                            (user) =>
                                user._id !== receiverId
                        );

                    return [
                        updatedUserData,
                        ...filteredUsers,
                    ];
                });

                // =========================
                // 3. Clear Reply
                // =========================
                setReplyingTo(null);

                // IMPORTANT
                return data;
            }

            return data;

        } catch (error) {
            console.error(
                "Send Message Error:",
                error
            );

            return {
                success: false,
                message: "Failed to send message",
            };

        } finally {
            setSendingMessage(false);
        }
    };
    // =========================
    // Get Users
    // =========================
    const getUsers = async () => {
        try {
            console.log("Fetching users...");

            const data = await fetchUsers();

            console.log("Response:", data);

            if (data.success) {

                // =========================
                // Users set karo
                // =========================
                setUsers(data.users);

                // =========================
                // Unread counts initialize karo
                // =========================
                const counts = {};

                data.users.forEach((user) => {
                    counts[user._id] = user.unreadCount || 0;
                });

                setUnreadCounts(counts);

            } else {
                setUsers([]);
                setUnreadCounts({});
            }

        } catch (error) {
            console.error("Get Users Error:", error);
            setUsers([]);
            setUnreadCounts({});
        }
    };
    // mark as seen 
    const markMessagesAsSeen = async (senderId) => {
        try {
            // console.log("Marking messages as seen:", senderId);

            const data = await markMessagesAsSeenApi(senderId);

            // console.log("Mark Seen Response:", data);

            if (data.success) {

                // 1. Unread badge clear
                setUnreadCounts((prev) => ({
                    ...prev,
                    [senderId]: 0,
                }));

                setMessages((prevMessages) =>
                    prevMessages.map((message) => {
                        if (
                            message.sender === senderId &&
                            !message.seen
                        ) {
                            return {
                                ...message,
                                seen: true,
                            };
                        }

                        return message;
                    })
                );
            }
        } catch (error) {
            console.error("Mark Messages Seen Error:", error);
        }
    };

    // delete for everyone
    const deleteMessageForEveryone = async (messageId) => {
        try {
            const data =
                await deleteMessageForEveryoneApi(
                    messageId
                );

            if (!data.success) {
                return data;
            }

            // =========================
            // Update current chat
            // =========================
            setMessages((prevMessages) =>
                prevMessages.map((message) => {

                    if (
                        message._id === messageId
                    ) {
                        return {
                            ...message,
                            isDeleted: true,
                            text: "",
                            image: "",
                        };
                    }

                    return message;
                })
            );

            return data;

        } catch (error) {
            console.error(
                "Delete Message Error:",
                error
            );

            return {
                success: false,
                message: "Failed to delete message",
            };
        }
    };

    const deleteMessageForMe = async (messageId) => {
        try {
            console.log("========== DELETE FOR ME FRONTEND ==========");
            console.log("Message ID:", messageId);

            const data = await deleteMessageForMeApi(messageId);

            console.log("Delete API Response:", data);

            if (!data.success) {
                console.log("Delete failed:", data.message);
                return data;
            }

            setMessages((prevMessages) => {
                console.log("Before delete:", prevMessages);

                const updatedMessages = prevMessages.filter(
                    (message) =>
                        message._id.toString() !== messageId.toString()
                );

                console.log("After delete:", updatedMessages);

                return updatedMessages;
            });

            return data;

        } catch (error) {
            console.error(
                "Delete Message For Me Error:",
                error
            );

            return {
                success: false,
                message: "Failed to delete message",
            };
        }
    };

    //======================
    // react to message
    //=======================
    const reactToMessage = async (messageId, emoji) => {
        try {
            console.log("========== REACT FRONTEND ==========");
            console.log("Message ID:", messageId);
            console.log("Emoji:", emoji);

            const data = await reactToMessageApi(
                messageId,
                emoji
            );

            if (!data.success) {
                console.error(
                    "Reaction failed:",
                    data.message
                );

                return data;
            }

            // Don't update messages here.
            // Socket event will update the message
            // for everyone, including current user.

            return data;

        } catch (error) {
            console.error(
                "React Message Error:",
                error
            );

            return {
                success: false,
                message: "Failed to react to message",
            };
        }
    };


    const nextSearchResult = () => {
        if (searchResults.length === 0) return;

        setSearchResultIndex((prev) => {
            if (prev >= searchResults.length - 1) {
                return 0;
            }

            return prev + 1;
        });
    };

    const previousSearchResult = () => {
        if (searchResults.length === 0) return;

        setSearchResultIndex((prev) => {
            if (prev <= 0) {
                return searchResults.length - 1;
            }

            return prev - 1;
        });
    };

    useEffect(() => {
        setSearchResultIndex(0);
    }, [messageSearchQuery]);

    // =========================
    // Fetch Users on Mount
    // =========================
    useEffect(() => {
        if (!isAuthenticated) {
            setUsers([]);
            return;
        }

        getUsers();
    }, [isAuthenticated]);


    // =========================
    // Socket Connection
    // =========================
    useEffect(() => {
        if (isAuthenticated) {
            if (!socket.connected) {
                socket.connect();
            }
        } else {
            if (socket.connected) {
                socket.disconnect();
            }

            setOnlineUsers([]);
        }
    }, [isAuthenticated]);
    // =========================
    // Fetch Messages when
    // Selected User Changes
    // =========================
    useEffect(() => {
        if (!selectedUser?._id) {
            setMessages([]);
            return;
        }

        const loadChat = async () => {
            setMessages([]);

            try {
                setLoadingMessages(true);

                const data = await fetchMessages(selectedUser._id);

                if (!data.success) {
                    setMessages([]);
                    return;
                }

                // Messages frontend me load
                setMessages(data.messages);

                // Check unread messages
                const hasUnreadMessages = data.messages.some(
                    (message) =>
                        message.sender === selectedUser._id &&
                        !message.seen
                );

                // Sirf unread messages hone par API call
                if (hasUnreadMessages) {
                    await markMessagesAsSeen(selectedUser._id);
                }

            } catch (error) {
                console.error("Load Chat Error:", error);
                setMessages([]);

            } finally {
                setLoadingMessages(false);
            }
        };

        loadChat();

    }, [selectedUser]);
    // =========================
    // Receive New Messages
    // =========================
    useEffect(() => {
        const handleNewMessage = (newMessage) => {

            // =========================
            // 1. Update Sidebar
            // =========================
            setUsers((prevUsers) => {
                const updatedUser = prevUsers.find(
                    (user) => user._id === newMessage.sender
                );

                // User sidebar me nahi mila
                if (!updatedUser) {
                    return prevUsers;
                }

                const updatedUserData = {
                    ...updatedUser,
                    lastMessage: newMessage,
                    lastMessageAt: newMessage.createdAt,
                };

                // Old position se remove
                const filteredUsers = prevUsers.filter(
                    (user) => user._id !== newMessage.sender
                );

                // Latest message wala user top par
                return [
                    updatedUserData,
                    ...filteredUsers,
                ];
            });

            // Message current selected chat se aaya hai
            if (selectedUser?._id === newMessage.sender) {

                setMessages((prevMessages) => {

                    // Duplicate message prevent
                    const alreadyExists = prevMessages.some(
                        (message) => message._id === newMessage._id
                    );

                    if (alreadyExists) {
                        return prevMessages;
                    }

                    return [
                        ...prevMessages,
                        newMessage,
                    ];
                });

                return;
            }

            // =========================
            // 3. Other Chat → Unread
            // =========================
            setUnreadCounts((prev) => ({
                ...prev,
                [newMessage.sender]:
                    (prev[newMessage.sender] || 0) + 1,
            }));

            // =========================
            // 4. Browser Notification
            // =========================
            if (
                "Notification" in window &&
                Notification.permission === "granted"
            ) {

                new Notification(
                    newMessage.senderUser?.name ||
                    "New Message",
                    {
                        body:
                            newMessage.text ||
                            "Sent you a message",

                        icon:
                            newMessage.senderUser
                                ?.profilePic ||
                            "/favicon.ico",
                    }
                );
            }
        };

        const handleMessageReactionUpdated = (data) => {
            console.log(
                "========== REACTION SOCKET =========="
            );

            console.log(
                "Message ID:",
                data.messageId
            );

            console.log(
                "Reactions:",
                data.reactions
            );

            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message._id === data.messageId
                        ? {
                            ...message,
                            reactions: data.reactions,
                        }
                        : message
                )
            );
        };

        socket.on(
            "messageReactionUpdated",
            handleMessageReactionUpdated
        );



        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };

    }, [selectedUser]);

    // delete for everyone
    useEffect(() => {

        const handleMessageDeleted = ({
            messageId,
            senderId,
            receiverId,
        }) => {

            // Current chat
            setMessages((prevMessages) =>
                prevMessages.map((message) => {

                    if (
                        message._id === messageId
                    ) {
                        return {
                            ...message,
                            isDeleted: true,
                            text: "",
                            image: "",
                        };
                    }

                    return message;
                })
            );
            // =========================
            // 2. Find Other User
            // =========================
            const otherUserId =
                senderId === user?._id
                    ? receiverId
                    : senderId;


            // =========================
            // 3. Update Sidebar
            // =========================
            setUsers((prevUsers) =>
                prevUsers.map((sidebarUser) => {

                    // Ye conversation nahi hai
                    if (
                        sidebarUser._id !==
                        otherUserId
                    ) {
                        return sidebarUser;
                    }

                    // Deleted message sidebar ka
                    // latest message nahi hai
                    if (
                        sidebarUser.lastMessage?._id !==
                        messageId
                    ) {
                        return sidebarUser;
                    }

                    // Sidebar latest message update
                    return {
                        ...sidebarUser,
                        lastMessage: {
                            ...sidebarUser.lastMessage,
                            isDeleted: true,
                            text: "",
                            image: "",
                        },
                    };
                })
            );
        };




        socket.on(
            "messageDeleted",
            handleMessageDeleted
        );

        return () => {
            socket.off(
                "messageDeleted",
                handleMessageDeleted
            );
        };

    }, [user?._id]);

    useEffect(() => {
        const handleMessagesSeen = ({ senderId, receiverId }) => {

            // =========================
            // 1. Update current messages
            // =========================
            setMessages((prevMessages) =>
                prevMessages.map((message) => {

                    if (
                        message.sender === senderId &&
                        message.receiver === receiverId
                    ) {
                        return {
                            ...message,
                            seen: true,
                        };
                    }

                    return message;
                })
            );


            // =========================
            // 2. Update sidebar
            // =========================
            setUsers((prevUsers) =>
                prevUsers.map((user) => {

                    if (user._id !== senderId) {
                        return user;
                    }

                    if (!user.lastMessage) {
                        return user;
                    }

                    return {
                        ...user,
                        lastMessage: {
                            ...user.lastMessage,
                            seen: true,
                        },
                    };
                })
            );
        };


        socket.on("messagesSeen", handleMessagesSeen);

        return () => {
            socket.off("messagesSeen", handleMessagesSeen);
        };

    }, []);
    // =========================
    // Online Users
    // =========================
    useEffect(() => {

        const handleOnlineUsers = (onlineUsers) => {
            setOnlineUsers(onlineUsers);
        };

        socket.on("onlineUsers", handleOnlineUsers);

        return () => {
            socket.off("onlineUsers", handleOnlineUsers);
        };

    }, []);

    // =========================
    // Offline Users
    // =========================
    useEffect(() => {
        const handleUserOffline = ({ userId, lastSeen }) => {

            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user._id === userId) {
                        return {
                            ...user,
                            isOnline: false,
                            lastSeen,
                        };
                    }

                    return user;
                })
            );
        };

        socket.on("userOffline", handleUserOffline);

        return () => {
            socket.off("userOffline", handleUserOffline);
        };
    }, []);


    useEffect(() => {

        const handleTyping = ({ senderId }) => {
            setTypingUser(senderId);
        };

        const handleStopTyping = ({ senderId }) => {
            setTypingUser(null);
        };

        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
        };

    }, []);


    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem(
                "selectedUser",
                JSON.stringify(selectedUser)
            );
        } else {
            localStorage.removeItem("selectedUser");
        }
    }, [selectedUser]);

    return (
        <ChatContext.Provider
            value={{
                selectedUser,
                setSelectedUser,

                messages,
                getMessages,

                sendMessage,

                loadingMessages,
                sendingMessage,

                onlineUsers,

                users,
                getUsers,
                typingUser,
                setTypingUser,
                markMessagesAsSeen,
                unreadCounts,
                deleteMessageForEveryone,
                deleteMessageForMe,
                replyingTo,
                setReplyingTo,
                inputRef,
                focusMessageInput,
                reactToMessage,

                // =========================
                // Message Search
                // =========================
                isSearchingMessages,
                setIsSearchingMessages,

                messageSearchQuery,
                setMessageSearchQuery,

                searchResultIndex,
                setSearchResultIndex,

                clearMessageSearch,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};


export const useChat = () => {
    return useContext(ChatContext);
};


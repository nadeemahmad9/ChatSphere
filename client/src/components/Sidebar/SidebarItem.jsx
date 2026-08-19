// import { useChat } from "../../context/ChatContext";

// const SidebarItem = ({ user, isOnline }) => {
//     const { selectedUser, setSelectedUser } = useChat();

//     return (
//         <button
//             type="button"
//             onClick={() => setSelectedUser(user)}
//             className={`flex items-center gap-3 w-full px-4 py-3 transition-colors hover:bg-slate-800 ${selectedUser?._id === user._id ? "bg-slate-800" : ""
//                 }`}
//         >
//             {/* Avatar */}
//             <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-lg font-semibold text-white">
//                 {user?.name?.charAt(0)?.toUpperCase()}
//             </div>

//             {/* User Info */}
//             <div className="flex-1 text-left">
//                 <h3 className="font-medium text-white">
//                     {user.name}
//                 </h3>

//                 <p
//                     className={`text-sm ${isOnline ? "text-green-400" : "text-gray-400"
//                         }`}
//                 >
//                     {isOnline ? "Online" : "Offline"}
//                 </p>
//             </div>
//         </button>
//     );
// };

// export default SidebarItem;


// import { Check, Circle } from "lucide-react";
// import { useChat } from "../../context/ChatContext";

// const SidebarItem = ({ user, isOnline }) => {
//     const { selectedUser, setSelectedUser, unreadCounts, } = useChat();

//     const isSelected = selectedUser?._id === user._id;
//     const unreadCount = unreadCounts[user._id] || 0;

//     return (
//         <button
//             type="button"
//             onClick={() => setSelectedUser(user)}
//             className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${isSelected
//                 ? "bg-blue-600/10"
//                 : "hover:bg-slate-900"
//                 }`}
//         >
//             {/* Active Indicator */}
//             {isSelected && (
//                 <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500" />
//             )}

//             {/* Avatar */}
//             <div className="relative shrink-0">

//                 <div
//                     className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white shadow-md ${isSelected
//                         ? "bg-linear-to-br from-blue-500 to-indigo-600"
//                         : "bg-slate-800"
//                         }`}
//                 >
//                     {user?.name?.charAt(0)?.toUpperCase()}
//                 </div>

//                 {/* Online Indicator */}
//                 <span
//                     className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${isOnline
//                         ? "bg-emerald-500"
//                         : "bg-slate-600"
//                         }`}
//                 />

//             </div>

//             {/* User Info */}
//             <div className="min-w-0 flex-1">

//                 <div className="flex items-center justify-between gap-2">

//                     <h3
//                         className={`truncate text-sm font-semibold ${isSelected
//                             ? "text-white"
//                             : "text-slate-200"
//                             }`}
//                     >
//                         {user?.name}

//                     </h3>

//                     <p className="mt-0.5 truncate text-xs text-slate-500">
//                         {user?.lastMessage?.text || "No messages yet"}
//                     </p>

//                     {user?.lastMessageAt && (
//                         <span className="text-[11px] text-slate-500">
//                             {new Date(user.lastMessageAt).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                             })}
//                         </span>
//                     )}

//                     {/* Unread Badge */}
//                     {unreadCount > 0 && !isSelected && (
//                         <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white">
//                             {unreadCount > 99 ? "99+" : unreadCount}
//                         </span>
//                     )}

//                     {/* Status Icon */}
//                     {isOnline && (
//                         <Circle
//                             size={7}
//                             fill="currentColor"
//                             className="shrink-0 text-emerald-400"
//                         />
//                     )}

//                 </div>

//                 <p
//                     className={`mt-0.5 truncate text-xs ${isOnline
//                         ? "text-emerald-400"
//                         : "text-slate-500"
//                         }`}
//                 >
//                     {isOnline ? "Online" : "Offline"}
//                 </p>

//             </div>

//             {/* Selected Check */}
//             {isSelected && (
//                 <Check
//                     size={16}
//                     className="shrink-0 text-blue-400"
//                 />
//             )}

//         </button>
//     );
// };

// export default SidebarItem;


import { Check, CheckCheck } from "lucide-react";
import { useChat } from "../../context/ChatContext";

const SidebarItem = ({ user, isOnline }) => {
    const {
        selectedUser,
        setSelectedUser,
        unreadCounts,
    } = useChat();

    const isSelected = selectedUser?._id === user._id;
    const unreadCount = unreadCounts[user._id] || 0;

    const lastMessage = user?.lastMessage;

    const lastMessageText = lastMessage?.isDeleted
        ? "🚫 This message was deleted"
        : lastMessage?.text?.trim() || "No messages yet";

    const lastMessageTime = user?.lastMessageAt
        ? new Date(user.lastMessageAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    // Last message current logged-in user ne bheja hai
    const isMyLastMessage =
        lastMessage &&
        lastMessage.sender !== user._id;

    const formatLastSeen = (lastSeen) => {
        if (!lastSeen) {
            return "Offline";
        }

        const date = new Date(lastSeen);

        return `Last seen ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    return (
        <button
            type="button"
            onClick={() => setSelectedUser(user)}
            className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 active:scale-[0.99] ${isSelected ? "bg-slate-800/90" : "hover:bg-slate-900/80"}`}
        >
            {/* Selected Indicator */}
            {isSelected && (
                <span className="absolute bottom-3 left-0 top-3 w-0.5 rounded-r-full bg-blue-500" />
            )}

            {/* Avatar */}
            <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-base font-semibold text-white shadow-sm ring-1 ring-white/5 ${user?.profilePic ? "bg-slate-800" : "bg-linear-to-br from-blue-500 to-indigo-600"}`}>
                    {user?.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        user?.name?.charAt(0)?.toUpperCase()
                    )}
                </div>

                {/* Online Indicator */}
                {isOnline && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
                )}
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">

                {/* Name + Time */}
                <div className="flex items-center justify-between gap-2">
                    <h3 className={`truncate text-sm font-semibold ${unreadCount > 0 ? "text-white" : isSelected ? "text-white" : "text-slate-200"}`}>
                        {user?.name}
                    </h3>

                    {lastMessageTime && (
                        <span className={`shrink-0 text-[10px] ${unreadCount > 0 ? "font-semibold text-blue-400" : "text-slate-500"}`}>
                            {lastMessageTime}
                        </span>
                    )}
                </div>

                {/* Last Message + Unread */}
                <div className="mt-1 flex min-w-0 items-center justify-between gap-2">

                    {/* Last Message */}
                    <div className="flex min-w-0 flex-1 items-center gap-1">

                        {/* Seen Status */}
                        {isMyLastMessage && !lastMessage?.isDeleted && (
                            lastMessage.seen ? (
                                <CheckCheck
                                    size={15}
                                    strokeWidth={2.2}
                                    className="shrink-0 text-blue-400"
                                />
                            ) : (
                                <Check
                                    size={14}
                                    strokeWidth={2.2}
                                    className="shrink-0 text-slate-500"
                                />
                            )
                        )}

                        <p className={`truncate text-xs ${lastMessage?.isDeleted ? "italic text-slate-500" : unreadCount > 0 ? "font-medium text-slate-300" : "text-slate-500"}`}>
                            {lastMessageText}
                        </p>
                    </div>

                    {/* Unread Badge */}
                    {unreadCount > 0 && !isSelected && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-blue-500/20">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </div>

                {/* Online / Offline */}
                <p className={`mt-1 truncate text-[10px] ${isOnline ? "text-emerald-400" : "text-slate-600"}`}>
                    {isOnline ? "Online" : formatLastSeen(user?.lastSeen)}
                </p>
            </div>
        </button>
    );
};

export default SidebarItem;
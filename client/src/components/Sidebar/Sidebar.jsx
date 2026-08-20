// import { Settings2, MessageCircle, Search } from "lucide-react";
// import SidebarItem from "./SidebarItem";
// import { useChat } from "../../context/ChatContext";

// const Sidebar = () => {
//     const { users, onlineUsers } = useChat();
//     console.log("Users:", users);
//     console.log("Online Users:", onlineUsers);
//     return (
//         <aside
//             className="
//                 flex flex-col

//                 w-80
//                 h-screen

//                 border-r border-slate-800

//                 bg-slate-900
//             "
//         >
//             {/* Header */}

//             <header
//                 className="
//                     flex items-center justify-between

//                     px-5
//                     py-4

//                     border-b border-slate-800
//                 "
//             >
//                 <div className="flex items-center gap-3">
//                     <div
//                         className="
//                             flex items-center justify-center

//                             h-10
//                             w-10

//                             rounded-xl

//                             bg-blue-600
//                         "
//                     >
//                         <MessageCircle size={22} className="text-white" />
//                     </div>

//                     <h1
//                         className="
//                             text-xl
//                             font-bold
//                             tracking-tight

//                             text-white
//                         "
//                     >
//                         ChatSphere
//                     </h1>
//                 </div>

//                 <button
//                     className="
//                         rounded-lg

//                         p-2

//                         text-slate-400

//                         transition-colors

//                         hover:bg-slate-800
//                         hover:text-white
//                     "
//                 >
//                     <Settings2 size={20} />
//                 </button>
//             </header>

//             {/* search Bar */}
//             <div
//                 className="p-4"
//             >
//                 <div
//                     className="relative"
//                 >
//                     <Search
//                         size={18}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     />

//                     <input
//                         type="text"
//                         placeholder="Search users..."
//                         className="w-full rounded-xl border border-slate-800 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 outline-none focus:border-blue-500 transition-colors"
//                     />
//                 </div>
//             </div>

//             {/* Side bar items */}
//             <div className="flex-1 overflow-y-auto">

//                 {users.length > 0 ? (
//                     users.map((user) => (
//                         <SidebarItem
//                             key={user._id}
//                             user={user}
//                             isOnline={onlineUsers.includes(user._id)}
//                         />
//                     ))
//                 ) : (
//                     <p>No users found</p>
//                 )}
//             </div>

//         </aside>
//     );
// };

// export default Sidebar;



// import { Settings2, MessageCircle, Search, UserRound } from "lucide-react";
// import SidebarItem from "./SidebarItem";
// import { useChat } from "../../context/ChatContext";

// const Sidebar = () => {
//     const { users, onlineUsers } = useChat();

//     console.log("Users:", users);
//     console.log("Online Users:", onlineUsers);

//     return (
//         <aside className="flex h-screen w-80 flex-col border-r border-slate-800 bg-slate-950">

//             {/* Header */}
//             <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

//                 <div className="flex items-center gap-3">

//                     {/* Logo */}
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
//                         <MessageCircle
//                             size={21}
//                             strokeWidth={2.5}
//                             className="text-white"
//                         />
//                     </div>

//                     {/* Brand */}
//                     <div>
//                         <h1 className="text-lg font-bold tracking-tight text-white">
//                             ChatSphere
//                         </h1>

//                         <p className="text-xs text-slate-500">
//                             Stay connected
//                         </p>
//                     </div>
//                 </div>

//                 {/* Settings */}
//                 <button
//                     className="rounded-xl p-2.5 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white active:scale-95"
//                     title="Settings"
//                 >
//                     <Settings2 size={19} />
//                 </button>

//             </header>

//             {/* Search */}
//             <div className="px-4 pb-3 pt-4">

//                 <div className="relative">

//                     <Search
//                         size={17}
//                         className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
//                     />

//                     <input
//                         type="text"
//                         placeholder="Search conversations..."
//                         className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
//                     />

//                 </div>

//             </div>

//             {/* Users Header */}
//             <div className="flex items-center justify-between px-5 py-2">

//                 <div className="flex items-center gap-2">
//                     <UserRound
//                         size={15}
//                         className="text-slate-500"
//                     />

//                     <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                         Conversations
//                     </span>
//                 </div>

//                 <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
//                     {users.length}
//                 </span>

//             </div>

//             {/* Sidebar Items */}
//             <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-3">

//                 {users.length > 0 ? (
//                     users.map((user) => (
//                         <SidebarItem
//                             key={user._id}
//                             user={user}
//                             isOnline={onlineUsers.includes(user._id)}
//                         />
//                     ))
//                 ) : (
//                     <div className="flex h-full flex-col items-center justify-center px-6 text-center">

//                         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
//                             <UserRound
//                                 size={24}
//                                 className="text-slate-600"
//                             />
//                         </div>

//                         <p className="text-sm font-medium text-slate-400">
//                             No users found
//                         </p>

//                         <p className="mt-1 text-xs text-slate-600">
//                             Your conversations will appear here
//                         </p>

//                     </div>
//                 )}

//             </div>

//         </aside>
//     );
// };

// export default Sidebar;


import {
    Settings2,
    MessageCircle,
    Search,
    UserRound,
    LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useContext } from "react";
import SidebarItem from "./SidebarItem";
import { useChat } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ onOpenProfile }) => {
    const { users, onlineUsers } = useChat();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    // =========================
    // Search Users
    // =========================
    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return users;
        }

        return users.filter((user) =>
            user.name?.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    return (
        <aside className="flex h-screen w-full flex-col border-r border-slate-800/80 bg-slate-900 sm:w-80">
            {/* =========================
                Header
            ========================= */}
            <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-800/80 px-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-3">
                    {/* Logo */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                        <img src="chat.png" alt="ChatSphere" className="h-9 w-9 object-contain" />
                    </div>

                    {/* Brand */}
                    <div className="min-w-0">
                        {/* <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                            ChatSphere
                        </h1> */}

                        <p className="text-[11px] text-slate-500 sm:text-xs">
                            Stay connected
                        </p>
                    </div>
                </div>

                {/* Settings + Logout */}
                <div className="flex shrink-0 items-center gap-0.5">
                    <button
                        type="button"
                        onClick={onOpenProfile}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:text-white active:scale-95"
                        title="Profile"
                        aria-label="Profile"
                    >
                        <img src="setting.png" alt="" />
                    </button>

                    <button
                        type="button"
                        onClick={async () => {
                            await logout();
                            navigate("/", { replace: true });
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                        title="Logout"
                        aria-label="Logout"
                    >
                        <LogOut size={19} />
                    </button>
                </div>
            </header>

            {/* =========================
                Search
            ========================= */}
            <div className="px-3 pb-2 pt-3 sm:px-4 sm:pt-3">
                <div className="relative">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations"
                        className="w-full rounded-lg border border-transparent bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-slate-700 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/10"
                    />
                </div>
            </div>

            {/* =========================
                Users Header
            ========================= */}
            <div className="flex shrink-0 items-center justify-between px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-2">
                    <UserRound size={15} className="text-slate-500" />

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Conversations
                    </span>
                </div>

                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                    {filteredUsers.length}
                </span>
            </div>

            {/* =========================
                Sidebar Items
            ========================= */}
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-2 pb-3">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <SidebarItem
                            key={user._id}
                            user={user}
                            isOnline={onlineUsers.includes(user._id)}
                        />
                    ))
                ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                            <UserRound size={24} className="text-slate-600" />
                        </div>

                        <p className="text-sm font-medium text-slate-400">
                            {searchQuery ? "No users found" : "No conversations yet"}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                            {searchQuery ? "Try another name" : "Your conversations will appear here"}
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
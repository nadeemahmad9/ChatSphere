import React, { useState } from "react";
import { useChat } from "../../context/ChatContext";
import {
    ArrowLeft,
    MoreVertical,
    Phone,
    Video,
    X,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

const ChatHeader = () => {
    const {
        selectedUser,
        onlineUsers,
        setSelectedUser,

        // =========================
        // Message Search
        // =========================
        isSearchingMessages,
        setIsSearchingMessages,
        messageSearchQuery,
        setMessageSearchQuery,
        searchResults,
        searchResultIndex,
        nextSearchResult,
        previousSearchResult,
    } = useChat();

    const [showMenu, setShowMenu] = useState(false);

    const isOnline = onlineUsers.includes(selectedUser?._id);

    // =========================
    // Close Search
    // =========================
    const closeSearch = () => {
        setIsSearchingMessages(false);
        setMessageSearchQuery("");
    };

    return (
        <header
            className="
                flex
                h-[68px]
                items-center
                border-b
                border-slate-800/80
                bg-slate-900
                px-2
                sm:px-4
            "
        >
            {/* =====================================================
                SEARCH MODE
            ====================================================== */}
            {isSearchingMessages ? (
                <div className="flex w-full items-center gap-1.5 sm:gap-2">

                    {/* Close Search */}
                    <button
                        type="button"
                        onClick={closeSearch}
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            transition-all
                            duration-200
                            hover:bg-slate-800
                            hover:text-white
                            active:scale-95
                        "
                        aria-label="Close search"
                    >
                        <X size={21} strokeWidth={2} />
                    </button>

                    {/* Search Input */}
                    <div
                        className="
                            flex
                            min-w-0
                            flex-1
                            items-center
                            rounded-xl
                            bg-slate-800/70
                            px-3
                        "
                    >
                        <span className="mr-2 text-slate-500">
                            🔍
                        </span>

                        <input
                            type="text"
                            autoFocus
                            value={messageSearchQuery}
                            onChange={(e) => {
                                setMessageSearchQuery(e.target.value);
                            }}
                            placeholder="Search messages..."
                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                py-2.5
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-500
                            "
                        />

                        {/* Clear Search Text */}
                        {messageSearchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMessageSearchQuery("");
                                }}
                                className="
                                    flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-slate-500
                                    hover:bg-slate-700
                                    hover:text-white
                                "
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {/* =========================
                        Search Result Count
                    ========================= */}
                    {messageSearchQuery.trim() && (
                        <span
                            className="
                                hidden
                                shrink-0
                                whitespace-nowrap
                                text-xs
                                text-slate-400
                                sm:block
                            "
                        >
                            {searchResults.length > 0
                                ? `${searchResultIndex + 1}/${searchResults.length}`
                                : "0/0"}
                        </span>
                    )}

                    {/* =========================
                        Previous Result
                    ========================= */}
                    <button
                        type="button"
                        onClick={previousSearchResult}
                        disabled={searchResults.length === 0}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            transition-all
                            hover:bg-slate-800
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                        "
                        aria-label="Previous search result"
                    >
                        <ChevronUp size={19} />
                    </button>

                    {/* =========================
                        Next Result
                    ========================= */}
                    <button
                        type="button"
                        onClick={nextSearchResult}
                        disabled={searchResults.length === 0}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            transition-all
                            hover:bg-slate-800
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                        "
                        aria-label="Next search result"
                    >
                        <ChevronDown size={19} />
                    </button>
                </div>
            ) : (

                /* =====================================================
                    NORMAL CHAT HEADER
                ====================================================== */
                <>
                    {/* =========================
                        Left Side
                    ========================= */}
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">

                        {/* Back Button - Mobile Only */}
                        <button
                            type="button"
                            onClick={() => setSelectedUser(null)}
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-slate-400
                                transition-all
                                duration-200
                                hover:bg-slate-800
                                hover:text-white
                                active:scale-95
                                md:hidden
                            "
                            aria-label="Back to conversations"
                        >
                            <ArrowLeft
                                size={21}
                                strokeWidth={2}
                            />
                        </button>

                        {/* Avatar */}
                        <div className="relative shrink-0">

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-700
                                    text-base
                                    font-semibold
                                    text-white
                                    ring-1
                                    ring-slate-700
                                    sm:h-12
                                    sm:w-12
                                "
                            >
                                {selectedUser?.profilePic ? (
                                    <img
                                        src={selectedUser.profilePic}
                                        alt={
                                            selectedUser?.name ||
                                            "User"
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    selectedUser?.name
                                        ?.charAt(0)
                                        ?.toUpperCase()
                                )}
                            </div>

                            {/* Online Indicator */}
                            <span
                                className={`
                                    absolute
                                    bottom-0
                                    right-0
                                    h-3
                                    w-3
                                    rounded-full
                                    border-2
                                    border-slate-900
                                    transition-colors
                                    duration-200
                                    ${isOnline
                                        ? "bg-emerald-500"
                                        : "bg-slate-500"
                                    }
                                `}
                            />

                        </div>

                        {/* User Info */}
                        <div className="min-w-0">

                            <h2
                                className="
                                    max-w-[150px]
                                    truncate
                                    text-[14px]
                                    font-semibold
                                    leading-5
                                    text-slate-100
                                    sm:max-w-[250px]
                                    sm:text-[15px]
                                "
                            >
                                {selectedUser?.name}
                            </h2>

                            <p
                                className={`
                                    text-[11px]
                                    leading-4
                                    transition-colors
                                    duration-200
                                    sm:text-xs
                                    ${isOnline
                                        ? "text-emerald-400"
                                        : "text-slate-500"
                                    }
                                `}
                            >
                                {isOnline
                                    ? "online"
                                    : "offline"}
                            </p>

                        </div>

                    </div>

                    {/* =========================
                        Right Side
                    ========================= */}
                    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">

                        {/* Audio Call - Desktop */}
                        <button
                            type="button"
                            className="
                                hidden
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                text-slate-400
                                transition-all
                                duration-200
                                hover:bg-slate-800
                                hover:text-white
                                active:scale-95
                                md:flex
                            "
                            aria-label="Audio Call"
                        >
                            <Phone
                                size={19}
                                strokeWidth={2}
                            />
                        </button>

                        {/* Video Call - Desktop */}
                        <button
                            type="button"
                            className="
                                hidden
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                text-slate-400
                                transition-all
                                duration-200
                                hover:bg-slate-800
                                hover:text-white
                                active:scale-95
                                md:flex
                            "
                            aria-label="Video Call"
                        >
                            <Video
                                size={20}
                                strokeWidth={2}
                            />
                        </button>

                        {/* =========================
                            More Options
                        ========================= */}
                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowMenu((prev) => !prev)
                                }
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-slate-400
                                    transition-all
                                    duration-200
                                    hover:bg-slate-800
                                    hover:text-white
                                    active:scale-95
                                "
                                aria-label="More Options"
                            >
                                <MoreVertical
                                    size={21}
                                    strokeWidth={2}
                                />
                            </button>

                            {/* =========================
                                Dropdown
                            ========================= */}
                            {showMenu && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-12
                                        z-50
                                        w-52
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-900
                                        py-1
                                        shadow-2xl
                                        shadow-black/40
                                    "
                                >

                                    {/* Search Messages */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMenu(false);
                                            setIsSearchingMessages(true);
                                            setMessageSearchQuery("");
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            text-slate-200
                                            transition-colors
                                            hover:bg-slate-800
                                        "
                                    >
                                        🔍
                                        <span>
                                            Search messages
                                        </span>
                                    </button>

                                    {/* Mute */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log(
                                                "Mute notifications clicked"
                                            );
                                            setShowMenu(false);
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            text-slate-200
                                            transition-colors
                                            hover:bg-slate-800
                                        "
                                    >
                                        🔔
                                        <span>
                                            Mute notifications
                                        </span>
                                    </button>

                                    {/* Clear Chat */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log(
                                                "Clear chat clicked"
                                            );
                                            setShowMenu(false);
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            text-slate-200
                                            transition-colors
                                            hover:bg-slate-800
                                        "
                                    >
                                        🗑️
                                        <span>
                                            Clear chat
                                        </span>
                                    </button>

                                    {/* Block */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log(
                                                "Block user clicked"
                                            );
                                            setShowMenu(false);
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            text-red-400
                                            transition-colors
                                            hover:bg-slate-800
                                        "
                                    >
                                        🚫
                                        <span>
                                            Block user
                                        </span>
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>
                </>
            )}

        </header>
    );
};

export default ChatHeader;
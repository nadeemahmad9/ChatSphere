import Sidebar from "../components/Sidebar/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import ProfilePanel from "../components/Profile/ProfilePanel";
import { useChat } from "../context/ChatContext";
import { useState } from "react";

const ChatLayout = () => {
    const [showProfile, setShowProfile] = useState(false);

    const { selectedUser } = useChat();

    return (
        <main className="flex h-dvh w-full overflow-hidden bg-slate-950">

            {/* Sidebar */}
            <div
                className={`
                    ${selectedUser ? "hidden md:flex" : "flex"}
                    w-full shrink-0
                    md:w-80
                `}
            >
                <Sidebar
                    onOpenProfile={() => setShowProfile(true)}
                />
            </div>

            {/* Chat Area */}
            <section
                className={`
                    ${selectedUser ? "flex" : "hidden md:flex"}
                    min-w-0 flex-1
                `}
            >
                <ChatWindow />
            </section>

            {/* Profile Panel */}
            {showProfile && (
                <ProfilePanel
                    onClose={() => setShowProfile(false)}
                />
            )}

        </main>
    );
};

export default ChatLayout;
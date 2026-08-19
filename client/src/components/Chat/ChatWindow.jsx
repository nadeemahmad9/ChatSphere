import React from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import WelcomeScreen from './WelcomeScreen'
import { useChat } from '../../context/ChatContext'

const ChatWindow = () => {
    const { selectedUser } = useChat();

    if (!selectedUser) {
        return <WelcomeScreen />;
    }
    return (
        <div className="flex h-full min-w-0 flex-1 flex-col bg-slate-950">
            <ChatHeader />

            <MessageList />

            <MessageInput />
        </div>
    )
}

export default ChatWindow
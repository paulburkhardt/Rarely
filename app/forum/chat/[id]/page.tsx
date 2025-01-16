'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Paperclip, Send } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { mockGroupChat, mockOlafChat, mockMariaChat, mockDiscussionChat } from '@/data/mock-group-chat'
import type { GroupChat, GroupChatMessage } from '@/types/groupChat'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from '@radix-ui/react-avatar'

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string
  
  // Determine which chat to show based on the ID
  const getChatData = (): GroupChat => {
    if (chatId.startsWith('private1')) {
      return mockOlafChat
    }
    else if (chatId.startsWith('private2')) {
      return mockMariaChat
    }
    else if (chatId.startsWith('discussion')) {
      return mockDiscussionChat
    }
    return mockGroupChat
  }
  
  const chatData = getChatData()
  const [messages, setMessages] = useState<GroupChatMessage[]>(chatData.messages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg: GroupChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: 'currentUser',
        name: 'You',
        imageUrl: '/placeholder.svg?height=32&width=32'
      },
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMsg])
    setNewMessage('')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E3D7F4] via-[#F7EED5] to-[#f8f8fa]">
      {/* Header */}
      <div className="p-6 pb-12">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <Link href="/forum" className="text-[#3a2a76]">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-black mb-1">{chatData.name}</h1>
              <p className="text-sm text-[#1E4D57]">{chatData.description}</p>
            </div>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={chatData.imageUrl} alt={chatData.name} />
            <AvatarFallback>{chatData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.sender.id === 'currentUser' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender.id !== 'currentUser' && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.sender.imageUrl} alt={message.sender.name} />
                <AvatarFallback>{message.sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                message.sender.id === 'currentUser'
                  ? 'bg-white/95 shadow-sm backdrop-blur-sm text-[#3a2a76]'
                  : 'bg-white/95 shadow-sm backdrop-blur-sm text-[#3a2a76]'
              }`}
            >
              {message.content}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            {message.sender.id === 'currentUser' && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.sender.imageUrl} alt={message.sender.name} />
                <AvatarFallback>{message.sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="bg-white/95 shadow-sm backdrop-blur-sm rounded-3xl p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#3a2a76]"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-[#3a2a76] hover:bg-[#a680db] text-white"
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 
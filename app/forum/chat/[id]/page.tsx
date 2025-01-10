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
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Link href="/forum" className="text-[#473F63]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={chatData.imageUrl}
              alt={chatData.name}
              className="w-10 h-10"
            />
            <AvatarFallback>{chatData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-medium text-[#473F63]">{chatData.name}</h1>
            <p className="text-sm text-[#1E4D57]">{chatData.description}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender.id === 'currentUser' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[80%] ${
              message.sender.id === 'currentUser' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {message.sender.id !== 'currentUser' && (
                <Avatar>
                  <AvatarImage
                    src={message.sender.imageUrl}
                    alt={message.sender.name}
                    className="w-8 h-8"
                  />
                  <AvatarFallback>{message.sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col ${
                message.sender.id === 'currentUser' ? 'items-end' : 'items-start'
              }`}>
                {message.sender.id !== 'currentUser' && (
                  <p className="text-xs text-[#1E4D57] mb-1">{message.sender.name}</p>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender.id === 'currentUser'
                      ? 'bg-[#E6E3FD] text-[#473F63]'
                      : 'bg-[#DEEAE5] text-[#1E4D57]'
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[#473F63]"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white border-[#E6E3FD] focus-visible:ring-[#473F63]"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-[#473F63]"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
} 
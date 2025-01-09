'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Heart, Paperclip, Send, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from 'ai/react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content: 'Hello! How can I help you today?'
  },
  {
    id: '2',
    role: 'user' as const,
    content: 'I need help with my garden. What are some easy vegetables to grow?'
  },
  {
    id: '3',
    role: 'assistant' as const,
    content: 'Some of the easiest vegetables to grow for beginners include tomatoes, lettuce, green beans, and radishes. They require minimal care and can grow well in containers too. Would you like specific tips for any of these?'
  }
]

const examplePrompts = [
  "What are common cold symptoms?",
  "How can I improve my sleep?",
  "Tips for staying healthy",
]

// Add welcome message constant
const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content: 'Hi there! I\'m Dr. Joni, your personal medical assistant. I\'m here to help answer your health-related questions and provide guidance. How can I assist you today?'
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleExampleClick = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleReset = () => {
    setMessages([welcomeMessage]);
  }

  // Add useEffect to show welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-white">

      {/* Logo */}
      <div className="flex justify-center items-center py-6">
        <Image 
          src="/logo_purple.png" 
          alt="Logo" 
          width={100}
          height={100}
          priority
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="/doctor-avatar.png" alt="Dr Joni" />
                <AvatarFallback className="bg-[#1E4D57] text-[#DEEAE5] ]">J</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-[#E6E3FD] text-[#473F63]'
                  : 'bg-[#DEEAE5] text-[#1E4D57]'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#473F63] text-[#E6E3FD]">ME</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#DEEAE5] text-[#1E4D57] rounded-2xl px-4 py-2">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
        {/* Example Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-4 px-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(prompt)}
              className="flex-shrink-0 bg-[#F5F4FF] text-[#473F63] px-3 py-1.5 rounded-full text-sm hover:bg-[#E6E3FD] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#473F63]"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="flex-1 bg-white border-[#E6E3FD] focus-visible:ring-[#473F63]"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-[#473F63]"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#473F63]"
            onClick={handleReset}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}


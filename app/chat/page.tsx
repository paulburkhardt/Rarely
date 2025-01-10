'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Heart, Paperclip, Send, Trash2, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from 'ai/react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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
  "What are common ACM symptoms?",
  "How can I manage my ACM diagnosis?",
  "Exercise guidelines for ACM patients",
]

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content: 'Hi there! I\'m Dr. Joni, your ACM specialist. I\'m here to help answer your questions about Arrhythmogenic Cardiomyopathy and provide guidance. How can I assist you today?'
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)

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

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        continue;
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    setUploadedFiles([...uploadedFiles, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-white">

      <div className="flex justify-center items-center py-6">
        <Image 
          src="/logo_purple.png" 
          alt="Logo" 
          width={100}
          height={100}
          priority
        />
      </div>

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

      <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-2 bg-[#F5F4FF] text-[#473F63] px-3 py-1.5 rounded-full text-sm"
              >
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.name)}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            className="hidden"
            multiple
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[#473F63]"
            onClick={() => fileInputRef.current?.click()}
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
            size="sm"
            className="text-[#473F63]"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[#473F63]"
            onClick={handleReset}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </form>

      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#1E4D57]">Welcome to Your ACM Assistant</DialogTitle>
            <DialogDescription className="space-y-4 pt-3">
              <p>
                I'm here to help you understand your medical documents and answer any questions about ACM.
              </p>
              <div className="bg-[#F5F4FF] p-4 rounded-lg">
                <h4 className="font-medium text-[#473F63] mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-[#473F63]">
                  You can upload your doctor's letters or medical reports (PDF format) using the paperclip icon. 
                  This helps me provide more personalized answers about your specific situation.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                All uploads are processed securely and confidentially.
                We try to use the data to gain insights about the condition and enable further research.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}


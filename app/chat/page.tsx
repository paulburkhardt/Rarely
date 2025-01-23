'use client'

import { useState, useRef, useEffect } from 'react'
import { Paperclip, Send, Trash2, X, Mic, MicOff } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useUser } from "@/contexts/UserContext"
import dynamic from 'next/dynamic'

const AudioRecorder = dynamic(() => import('@/components/audio-recorder'), { ssr: false });

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content: 'Hi there! I\'m Jona, your ACM assistant. I\'m here to help answer your questions about Arrhythmogenic Cardiomyopathy and provide guidance. How can I assist you today?'
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string;
}

interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const examplePrompts = [
  "What is ACM?",
  "What are the symptoms?",
  "Is ACM hereditary?",
  "How is ACM diagnosed?"
];

interface MessageSummary {
  id: string;
  role: 'system';
  content: string;
  isSummary: true;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type Message = ChatMessage | MessageSummary;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Define the type for the recorder hook
type ReactMediaRecorderHook = {
  status: string;
  startRecording: () => void;
  stopRecording: () => void;
  mediaBlobUrl: string | null;
}

export default function ChatPage() {
  const { userData } = useUser();
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize messages from localStorage if available, otherwise use welcomeMessage
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages');
      return savedMessages ? JSON.parse(savedMessages) : [welcomeMessage];
    }
    return [welcomeMessage];
  });
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleRecordingStop = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const { text } = await response.json();
      setInput(text);
    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const toggleListening = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedChat');
    
    if (!hasVisited) {
      // Add a small delay to ensure the modal renders after component mount
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
        // Set the flag in localStorage
        localStorage.setItem('hasVisitedChat', 'true');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim()
    }
    
    const documentInfo = uploadedFiles.length > 0 
      ? `\n\n[Using context from: ${uploadedFiles.map(f => f.name).join(', ')}]`
      : '';
    
    setMessages(messages => [...messages, {
      ...userMessage,
      content: userMessage.content + documentInfo
    }])
    setInput('')
    setIsLoading(true)

    try {
      const documentContext = uploadedFiles
        .map(file => `Content from ${file.name}:\n${file.content}`)
        .join('\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content
          })),
          documentContext: documentContext || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          setMessages(messages => [...messages, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: errorData.message || "You've reached the message limit for the demo. Unfortunately the api bill will drown us otherwise:("
          }]);
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to fetch response');
      }

      const data = await response.json()
      
      setUploadedFiles([])
      
      setMessages(messages => [...messages, {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.message
      }])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
  }

  const handleReset = () => {
    setMessages([welcomeMessage]);
    localStorage.removeItem('chatMessages');
  };

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
      if (!file.type.startsWith('application/pdf') && !file.type.startsWith('image/')) {
        alert('Only PDF and image files are allowed');
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        continue;
      }

      try {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('file', file);

        // Send to your API endpoint for OCR processing
        const response = await fetch('/api/ocr', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('OCR processing failed');
        }

        const { text } = await response.json();

        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          content: text,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error processing ${file.name}`);
      }
    }

    setUploadedFiles([...uploadedFiles, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
  };

  // Add effect to save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Add this useEffect to check for speech recognition support
  useEffect(() => {
    const checkSupport = async () => {
      try {
        // Check if browser supports getUserMedia
        const hasMediaSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        // Check if browser supports necessary APIs
        const hasRequiredAPIs = 'MediaRecorder' in window;
        
        setSpeechSupported(hasMediaSupport && hasRequiredAPIs);
      } catch (error) {
        setSpeechSupported(false);
      }
    };
    
    checkSupport();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F5F5] via-[#F5F5F5] to-[#F5F5F5]">
      {/* Header */}
      <div className="p-6 pb-2">
        {/* Logo centered, Avatar right */}
        <div className="flex items-center relative mb-6">
          <div className="w-full flex justify-center">
            <Image 
              src="/logo_final.png" 
              alt="Logo" 
              width={120}
              height={120}
              className="opacity-90"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-black mb-1">Chat Assistant</h1>
      </div>

      {/* Chat Messages - Updated with modern styling */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-in fade-in slide-in-from-bottom-2`}
          >
            {message.role === 'assistant' && (
              <Avatar className="w-8 h-8 ring-2 ring-white">
                <AvatarImage src="/doctor-avatar.png" alt="Dr Joni" />
                <AvatarFallback className="bg-[#3a2a76] text-white">J</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-[#FAF9F6] text-[#3a2a76]'
                  : 'bg-white/95 text-[#3a2a76]'
              } shadow-sm backdrop-blur-sm`}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose prose-sm max-w-none prose-p:leading-normal prose-pre:p-0 prose-headings:text-current prose-a:text-current"
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {message.role === 'user' && (
              <Avatar className="w-8 h-8 ring-2 ring-white">
                <AvatarFallback className="bg-[#3a2a76] text-white">
                  {userData?.name?.slice(0, 2) || 'Me'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2.5 text-[#3a2a76] shadow-sm animate-pulse">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Updated with modern styling */}
      <div className="px-3 sm:px-4 pb-4">
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg">
          {uploadedFiles.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              <div className="text-sm text-gray-500 px-2">
                Attached documents:
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-2 bg-[#3a2a76]/10 text-[#3a2a76] px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(file.size)})
                    </span>
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
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-3 px-2 scrollbar-hide">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(prompt)}
                className="flex-shrink-0 bg-gradient-to-br from-[#3a2a76]/10 to-[#FF8E8E]/10 text-[#302d36] px-3 py-1.5 rounded-full text-sm hover:from-[#3a2a76]/20 hover:to-[#3a2a76]/20 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf, image/*"
              className="hidden"
              multiple
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#302d36]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            {speechSupported && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[#302d36] transition-colors"
                  onClick={toggleListening}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                {isRecording && <AudioRecorder onStop={handleRecordingStop} isRecording={isRecording} />}
              </>
            )}
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-gray-200 focus-visible:ring-[#3a2a76] rounded-full px-4"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-[#3a2a76] to-[#3a2a76] text-white hover:opacity-90 transition-opacity rounded-full px-4"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#302d36]  transition-colors"
              onClick={handleReset}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Welcome Dialog - Updated with modern styling */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="bg-white rounded-3xl shadow-xl max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2D3436] text-xl font-semibold">Welcome to Your ACM Assistant</DialogTitle>
            <DialogDescription className="space-y-4 pt-3">
              <p className="text-gray-600">
                I'm here to help you understand your medical documents and answer any questions about ACM.
              </p>
              <div className="bg-[#3a2a76]/10 p-4 rounded-xl">
                <h4 className="font-medium text-[#3a2a76] mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-[#3a2a76]">
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


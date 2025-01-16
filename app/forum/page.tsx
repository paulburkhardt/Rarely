'use client'

import { Suspense, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, MessageCircle, Users, Heart, User } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { colors } from '@/styles/colors'
import { useSearchParams, useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { mockGroups, mockDiscussions, mockPrivateChats } from '@/data/mock-forum'
import Image from 'next/image'
import { useUser } from "@/contexts/UserContext"


type Group = {
  id: string
  name: string
  description: string
  imageUrl: string
  lastActivity: Date
  memberCount: number
  unreadCount?: number
}

type Discussion = {
  id: string
  title: string
  group: Group
  messageCount: number
  lastUpdated: Date
}

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

function formatDateTime(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'long' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

function ForumContent() {
  const { userData } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get('tab') || 'groups'

  const handleTabChange = (value: string) => {
    router.push(`/forum?tab=${value}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E3D7F4] via-[#F7EED5] to-[#f8f8fa]">
      
      {/* Header */}
      <div className="p-6 pb-2">
        {/* Logo centered, Avatar right */}
        <div className="flex items-center relative mb-6">
          <div className="w-full flex justify-center">
            <Image 
              src="/logo_green.png" 
              alt="Logo" 
              width={100} 
              height={100} 
              className="opacity-90"
            />
          </div>
          <div className="absolute right-0">
            <Avatar className="h-8 w-8">
              <AvatarImage alt="User avatar" />
              <AvatarFallback>{userData.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-black mb-1">Forum</h1>
      </div>

      {/* Main Content - Adjusted spacing */}
      <div className="px-4 pb-24 space-y-4">
        <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-white/95 shadow-sm backdrop-blur-sm">
            <TabsTrigger 
              value="groups"
              className="rounded-lg data-[state=active]:bg-[#3a2a76] data-[state=active]:text-white transition-all duration-200"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger 
              value="private"
              className="rounded-lg data-[state=active]:bg-[#3a2a76] data-[state=active]:text-white transition-all duration-200"
            >
              Private Chats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-4">
            {/* Trending Discussions */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-black px-1">Trending Discussions</h2>
              {mockDiscussions.map((discussion, index) => (
                <div key={discussion.id}>
                  <Link href={`/forum/chat/discussion${discussion.id}`}>
                    <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl border-0">
                      <div className="p-4 flex items-start gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-[#3a2a76]/10 ring-offset-2">
                          <AvatarImage src={discussion.group.imageUrl} alt={discussion.group.name} className="object-cover" />
                          <AvatarFallback className="bg-[#3a2a76] text-white">
                            {discussion.group.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-black">{discussion.group.name}</h3>
                          <p className="text-sm text-[#1E4D57]/80">{discussion.title}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-[#1E4D57]/60">{formatDateTime(discussion.lastUpdated)}</span>
                          {discussion.messageCount > 0 && (
                            <div className="w-6 h-6 rounded-full bg-[#3a2a76] text-white text-xs flex items-center justify-center">
                              {discussion.messageCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                  {index < mockDiscussions.length - 1 && <hr className="border-gray-200 mx-4" />}
                </div>
              ))}
            </div>

            {/* Group Discussions */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-black px-1">Group Discussions</h2>
              {mockGroups.map((group, index) => (
                <div key={group.id}>
                  <Link href={`/forum/chat/${group.id}`}>
                    <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl border-0">
                      <div className="p-4 flex items-start gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-[#3a2a76]/10 ring-offset-2">
                          <AvatarImage src={group.imageUrl} alt={group.name} className="object-cover" />
                          <AvatarFallback className="bg-[#3a2a76] text-white">
                            {group.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-black">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-[#1E4D57]/80">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {group.memberCount} members
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-[#1E4D57]/60">{formatDateTime(group.lastActivity)}</span>
                          {group.unreadCount && group.unreadCount > 0 && (
                            <div className="w-6 h-6 rounded-full bg-[#3a2a76] text-white text-xs flex items-center justify-center">
                              {group.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                  {index < mockGroups.length - 1 && <hr className="border-gray-200 mx-4" />}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="private" className="space-y-2">
            {mockPrivateChats.map((chat, index) => (
              <div key={chat.id}>
                <Link href={`/forum/chat/private${chat.id}`}>
                  <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl border-0">
                    <div className="p-4 flex items-start gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-[#1E4D57]/10 ring-offset-2">
                        <AvatarImage src={chat.userImage} alt={chat.userName} className="object-cover" />
                        <AvatarFallback className="bg-[#3a2a76] text-white">
                          {chat.userName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-black">{chat.userName}</h3>
                        <p className="text-sm text-[#1E4D57]/80 truncate mt-1">{chat.lastMessage}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-[#1E4D57]/60">{formatDateTime(chat.lastMessageTime)}</span>
                        {chat.unreadCount > 0 && (
                          <div className="w-6 h-6 rounded-full bg-[#3a2a76] text-white text-xs flex items-center justify-center">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
                {index < mockPrivateChats.length - 1 && <hr className="border-gray-200 mx-4" />}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t">
        <div className="flex justify-around items-center py-2">
          <Link href="/" className="flex flex-col items-center p-2">
            <Heart className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Summary</span>
          </Link>
          <Link href="/sharing" className="flex flex-col items-center p-2">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Sharing</span>
          </Link>
          <Link href="/forum" className="flex flex-col items-center p-2">
            <MessageCircle className="w-6 h-6 text-[#3a2a76]" />
            <span className="text-xs text-[#3a2a76] font-medium">Forum</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


// Main component wrapped in Suspense
export default function ForumPage() {
  const { userData } = useUser();
  
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-5rem)]  p-2 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#473F63] mb-4">
          Forum
          <span className="block text-base font-normal text-[#1E4D57]/80 mt-1">
            Connect with your community
          </span>
        </h1>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-xl mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ForumContent />
    </Suspense>
  )
}
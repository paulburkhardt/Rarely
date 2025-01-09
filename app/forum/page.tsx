'use client'

import { Suspense, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, MessageCircle, Users } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { colors } from '@/styles/colors'
import { useSearchParams, useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { mockGroups, mockDiscussions, mockPrivateChats } from '@/data/mock-forum'


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


function ForumContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'groups'

  const handleTabChange = (value: string) => {
    router.push(`/forum?tab=${value}`)
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#473F63] mb-4">
        Forum
        <span className="block text-base font-normal text-[#1E4D57]/80 mt-1">
          Connect with your community
        </span>
      </h1>
      
      <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
        <TabsList className={`grid w-full grid-cols-2 rounded-xl p-1 ${
          activeTab === 'private' ? 'bg-[#DEEAE5]' : 'bg-[#E6E3FD]'
        }`}>
          <TabsTrigger 
            value="groups"
            className="rounded-lg data-[state=active]:bg-[#473F63] data-[state=active]:text-white transition-all duration-200"
          >
            Groups
          </TabsTrigger>
          <TabsTrigger 
            value="private"
            className="rounded-lg data-[state=active]:bg-[#1E4D57] data-[state=active]:text-white transition-all duration-200"
          >
            Private Chats
          </TabsTrigger>
        </TabsList>


          

        <TabsContent value="groups" className="grid gap-2">
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-[#473F63] mb-2">Trending Discussions</h2>
            {mockDiscussions.map((discussion) => (
              <Link key={discussion.id} href={`/forum/chat/discussion${discussion.id}`}>
                <div className="flex items-center p-2 border-b border-gray-200">
                  <Avatar className="w-10 h-10 mr-2">
                    <AvatarImage src={discussion.group.imageUrl} alt={discussion.group.name} />
                    <AvatarFallback className="bg-[#473F63] text-[#E6E3FD]">
                      {discussion.group.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 ml-2">
                    <h3 className="text-[#473F63] font-medium text-lg group-hover:text-[#1E4D57] transition-colors">
                      {discussion.group.name}
                    </h3>
                    <p className="text-[#473F63]/90 text-sm mt-1">
                      {discussion.title}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className="mt-2 bg-[#E6E3FD]/50 text-[#473F63]"
                    >
                      {discussion.messageCount} messages
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        <h2 className="text-xl font-semibold text-[#473F63] mb-2">Group Discussions</h2>
          {mockGroups.map((group) => (
            <Link key={group.id} href={`/forum/chat/${group.id}`}>
              <div className="flex items-center p-2 border-b border-gray-200">
                <Avatar className="w-10 h-10 mr-2">
                  <AvatarImage src={group.imageUrl} alt={group.name} />
                  <AvatarFallback className="bg-[#473F63] text-[#E6E3FD]">
                    {group.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 ml-2">
                  <h3 className="text-[#473F63] font-medium text-lg group-hover:text-[#1E4D57] transition-colors">
                    {group.name}
                  </h3>
                 {/*  <p className="text-[#473F63]/90 text-sm mt-1 line-clamp-2">
                    {group.description}
                  </p> */}
                  <div className="flex items-center gap-2 mt-1 text-sm text-[#473F63]/80 group-hover:text-[#473F63]">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {group.memberCount} members
                    </div>
                    <span className="ml-auto">Active {formatTimeAgo(group.lastActivity)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

        </TabsContent>

        <TabsContent value="private" className="grid gap-2">
          {mockPrivateChats.map((chat) => (
            <Link key={chat.id} href={`/forum/chat/private${chat.id}`}>
              <div className="flex items-center p-2 border-b border-gray-200">
                <Avatar className="w-10 h-10 mr-2">
                  <AvatarImage src={chat.userImage} alt={chat.userName} />
                  <AvatarFallback className="bg-[#1E4D57] text-[#DEEAE5]">
                    {chat.userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 ml-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#1E4D57] font-medium">
                      {chat.userName}
                    </h3>
                    <span className="text-xs text-[#1E4D57]/80">
                      {formatTimeAgo(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-[#1E4D57]/90 truncate mt-1">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="mt-2 bg-[#DEEAE5] text-[#1E4D57]">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}


// Main component wrapped in Suspense
export default function ForumPage() {
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
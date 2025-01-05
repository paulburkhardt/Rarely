'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, MessageCircle, Users } from 'lucide-react'
import Link from 'next/link'

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
  groupName: string
  groupImage: string
  messageCount: number
}

const groups: Group[] = [
  {
    id: '1',
    name: 'Chronic Pain Support',
    description: 'Share experiences and tips for managing chronic pain',
    imageUrl: '/placeholder.svg?height=48&width=48',
    lastActivity: new Date('2024-01-04T21:48:00'),
    memberCount: 1234,
    unreadCount: 3
  },
  {
    id: '2',
    name: 'Treatment Discussions',
    description: 'Discussion about various treatment options',
    imageUrl: '/placeholder.svg?height=48&width=48',
    lastActivity: new Date('2024-01-04T15:30:00'),
    memberCount: 856
  },
  {
    id: '3',
    name: 'Daily Wellness Tips',
    description: 'Daily tips for maintaining wellness',
    imageUrl: '/placeholder.svg?height=48&width=48',
    lastActivity: new Date('2024-01-03T19:20:00'),
    memberCount: 2341,
    unreadCount: 1
  }
]

const discussions: Discussion[] = [
  {
    id: '1',
    title: 'New research on chronic pain management',
    groupName: 'Chronic Pain Support',
    groupImage: '/placeholder.svg?height=32&width=32',
    messageCount: 15
  },
  {
    id: '2',
    title: 'Share your wellness journey',
    groupName: 'Daily Wellness Tips',
    groupImage: '/placeholder.svg?height=32&width=32',
    messageCount: 8
  }
]

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState('groups')

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white to-[#f8f8ff]">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-[#473F63] mb-6">Forum</h1>
        
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-2 rounded-xl p-1 ${
            activeTab === 'private' ? 'bg-[#DEEAE5]' : 'bg-[#E6E3FD]'
          }`}>
            <TabsTrigger 
              value="groups"
              onClick={() => setActiveTab('groups')}
              className="rounded-lg data-[state=active]:bg-[#473F63] data-[state=active]:text-white transition-all duration-200"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger 
              value="private"
              onClick={() => setActiveTab('private')}
              className="rounded-lg data-[state=active]:bg-[#1E4D57] data-[state=active]:text-white transition-all duration-200"
            >
              Private Chats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-8">
            {/* Your Groups */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#473F63] text-lg font-medium flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Your Groups
                </h2>
                <Link href="#" className="text-sm text-[#1E4D57] hover:text-[#473F63] transition-colors">
                  View all
                </Link>
              </div>
              <div className="space-y-10">
                {groups.map((group) => (
                  <Link key={group.id} href={`/forum/chat/${group.id}`}>
                    <Card className="p-4 border-b border-gray-100 hover:bg-[#E6E3FD]/30 transition-colors duration-200 rounded-none shadow-none">
                      <div className="flex items-center gap-4">
                        <img
                          src={group.imageUrl}
                          alt={group.name}
                          className="w-12 h-12 rounded-full shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[#473F63] font-medium truncate">
                              {group.name}
                            </h3>
                            <span className="text-xs text-[#1E4D57]">
                              {formatTimeAgo(group.lastActivity)}
                            </span>
                          </div>
                          <p className="text-sm text-[#1E4D57] truncate mt-1">
                            {group.description}
                          </p>
                        </div>
                        {group.unreadCount && (
                          <span className="bg-[#473F63] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                            {group.unreadCount}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Discussions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#473F63] text-lg font-medium flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  Trending Discussions
                </h2>
                <Link href="#" className="text-sm text-[#1E4D57] hover:text-[#473F63] transition-colors">
                  View all
                </Link>
              </div>
              <div className="space-y-10">
                {discussions.map((discussion) => (
                  <Link key={discussion.id} href={`/forum/chat/discussion${discussion.id}`}>
                    <Card className="p-4 border-b border-gray-100 hover:bg-[#E6E3FD]/30 transition-colors duration-200 rounded-none shadow-none">
                      <div className="flex items-center gap-4">
                        <img
                          src={discussion.groupImage}
                          alt={discussion.groupName}
                          className="w-12 h-12 rounded-full shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[#473F63] font-medium truncate">
                              {discussion.title}
                            </h3>
                            <span className="text-xs text-[#1E4D57] bg-[#E6E3FD]/50 px-2 py-1 rounded-full">
                              {discussion.messageCount} messages
                            </span>
                          </div>
                          <p className="text-sm text-[#1E4D57] truncate mt-1">
                            {discussion.groupName}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private" className="space-y-10">
            {[
              {
                id: '1',
                name: 'Dr. Sarah Johnson',
                image: '/placeholder.svg?height=40&width=40',
                lastMessage: 'How are you feeling today?',
                time: new Date('2024-01-04T21:55:00'),
                unread: 2
              },
              {
                id: '2',
                name: 'Support Coach Mike',
                image: '/placeholder.svg?height=40&width=40',
                lastMessage: 'Great progress on your exercises!',
                time: new Date('2024-01-04T20:30:00'),
                unread: 0
              }
            ].map((chat) => (
              <Link key={chat.id} href={`/forum/chat/private${chat.id}`}>
                <Card className="p-4 border-b border-gray-100 hover:bg-[#DEEAE5] transition-colors duration-200 rounded-none shadow-none">
                  <div className="flex items-center gap-4">
                    <img
                      src={chat.image}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[#473F63] font-medium">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-[#1E4D57]">
                          {formatTimeAgo(chat.time)}
                        </span>
                      </div>
                      <p className="text-sm text-[#1E4D57] truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-[#1E4D57] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


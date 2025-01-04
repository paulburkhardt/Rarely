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
    <div className="min-h-[calc(100vh-5rem)] bg-white">
      <div className="p-4">
        <h1 className="text-xl font-semibold text-[#473F63] mb-4">Forum</h1>
        
        <Tabs defaultValue="groups" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#E6E3FD]">
            <TabsTrigger 
              value="groups"
              className="data-[state=active]:bg-[#473F63] data-[state=active]:text-white"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger 
              value="private"
              className="data-[state=active]:bg-[#473F63] data-[state=active]:text-white"
            >
              Private Chats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            {/* Your Groups */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[#473F63] font-medium flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Groups
                </h2>
                <Link href="#" className="text-sm text-[#1E4D57]">
                  View all
                </Link>
              </div>
              <div className="space-y-2">
                {groups.map((group) => (
                  <Card key={group.id} className="p-3 bg-[#DEEAE5]">
                    <div className="flex items-center gap-3">
                      <img
                        src={group.imageUrl}
                        alt={group.name}
                        className="w-12 h-12 rounded-full"
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
                        <p className="text-sm text-[#1E4D57] truncate">
                          {group.description}
                        </p>
                      </div>
                      {group.unreadCount && (
                        <span className="bg-[#473F63] text-white text-xs px-2 py-1 rounded-full">
                          {group.unreadCount}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trending Discussions */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[#473F63] font-medium flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Trending Discussions
                </h2>
                <Link href="#" className="text-sm text-[#1E4D57]">
                  View all
                </Link>
              </div>
              <div className="space-y-2">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="p-3 bg-[#E6E3FD]">
                    <Link href="#" className="space-y-2">
                      <h3 className="text-[#473F63] font-medium">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={discussion.groupImage}
                            alt={discussion.groupName}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-[#1E4D57]">
                            {discussion.groupName}
                          </span>
                        </div>
                        <span className="text-[#1E4D57]">
                          {discussion.messageCount} messages
                        </span>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private" className="space-y-4">
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
              <Card key={chat.id} className="p-3 bg-[#DEEAE5]">
                <Link href="#" className="flex items-center gap-3">
                  <img
                    src={chat.image}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full"
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
                    <p className="text-sm text-[#1E4D57] truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-[#473F63] text-white text-xs px-2 py-1 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#473F63]" />
                </Link>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


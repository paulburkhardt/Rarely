import { Group, Discussion, PrivateChat } from '../types/forum'

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'ACM Support Community',
    description: 'Share experiences and support for living with ACM/ARVC',
    imageUrl: '/placeholder.svg?height=48&width=48',
    lastActivity: new Date('2024-01-04T21:48:00'),
    memberCount: 1234,
    unreadCount: 3
  },
  {
    id: '2',
    name: 'Treatment & Medications',
    description: 'Discussions about ACM treatments, medications, and ICD management',
    imageUrl: '/placeholder.svg?height=48&width=48',
    lastActivity: new Date('2024-01-04T15:30:00'),
    memberCount: 856
  },
  {
    id: '3',
    name: 'Exercise & Lifestyle',
    description: 'Safe exercise guidelines and lifestyle modifications for ACM patients',
    imageUrl: '/placeholder.svg?height=48&width=48',
    lastActivity: new Date('2024-01-03T19:20:00'),
    memberCount: 2341,
    unreadCount: 1
  }
]

export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'New genetic testing options for ACM',
    group: mockGroups[0],
    messageCount: 15,
    lastUpdated: new Date('2024-01-04T22:00:00')
  },
  {
    id: '2',
    title: 'Managing exercise restrictions with ACM',
    group: mockGroups[2],
    messageCount: 8,
    lastUpdated: new Date('2024-01-04T21:30:00')
  }
]

export const mockPrivateChats: PrivateChat[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Olaf',
    userImage: '/placeholder.svg?height=40&width=40',
    lastMessage: 'How are your ICD readings...?',
    lastMessageTime: new Date('2024-01-04T21:55:00'),
    unreadCount: 2
  },
  {
    id: '2',
    userId: '2',
    userName: 'Maria',
    userImage: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Remember to stay within your...',
    lastMessageTime: new Date('2024-01-04T20:30:00'),
    unreadCount: 0
  }
]


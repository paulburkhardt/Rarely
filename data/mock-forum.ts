import { Group, Discussion, PrivateChat } from '../types/forum'

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'ACM Support Community',
    description: 'Share experiences and support for living with ACM/ARVC',
    imageUrl: '/icons/heart-pulse.svg',
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    memberCount: 76,
    unreadCount: 3
  },
  {
    id: '2',
    name: 'Treatment & Medications',
    description: 'Discussions about ACM treatments, medications, and ICD management',
    imageUrl: '/icons/medicine.svg',
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
    memberCount: 89
  },
  {
    id: '3',
    name: 'Exercise & Lifestyle',
    description: 'Safe exercise guidelines and lifestyle modifications for ACM patients',
    imageUrl: '/icons/exercise.svg',
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    memberCount: 102,
    unreadCount: 1
  }
]

export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'New genetic testing options for ACM',
    group: mockGroups[0],
    messageCount: 15,
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Managing exercise restrictions with ACM',
    group: mockGroups[2],
    messageCount: 8,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
]

export const mockPrivateChats: PrivateChat[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Olaf',
    userImage: '/icons/avatar-1.svg',
    lastMessage: 'How are your ICD readings...?',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 2
  },
  {
    id: '2',
    userId: '2',
    userName: 'Maria',
    userImage: '/icons/avatar-2.svg',
    lastMessage: 'Remember to stay within your...',
    lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unreadCount: 0
  }
]


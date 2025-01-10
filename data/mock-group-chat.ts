import { GroupChat } from '@/types/groupChat'

export const mockGroupChat: GroupChat = {
  id: '1',
  name: 'ACM Support Community',
  description: 'Share experiences and support for living with ACM/ARVC',
  imageUrl: '/icons/heart-pulse.svg',
  messages: [
    {
      id: '1',
      content: 'Has anyone had experience with ICD implantation recovery?',
      sender: {
        id: 'user1',
        name: 'Maria',
      },
      timestamp: new Date('2024-01-04T14:00:00')
    },
    {
      id: '2',
      content: 'Yes, I had mine implanted 6 months ago. Recovery was smooth - back to normal activities within weeks.',
      sender: {
        id: 'user2',
        name: 'Olaf',
      },
      timestamp: new Date('2024-01-04T14:05:00')
    },
    {
      id: '3',
      content: 'Could you recommend your acupuncturist? I\'m looking to try it.',
      sender: {
        id: 'user3',
        name: 'Emily Chen',
      },
      timestamp: new Date('2024-01-04T14:10:00')
    }
  ]
}



export const mockDiscussionChat: GroupChat = {
  id: 'discussion1',
  name: 'New genetic testing options for ACM',
  description: 'Discussion in ACM Support Community',
  imageUrl: '/icons/heart-pulse.svg',
  messages: [
    {
      id: 'd1',
      content: 'Has anyone seen the new research paper on chronic pain management published in Nature?',
      sender: {
        id: 'user4',
        name: 'Dr. James Wilson',
      },
      timestamp: new Date('2024-01-04T15:00:00')
    },
    {
      id: 'd2',
      content: 'Yes! The findings about neuroplasticity are fascinating.',
      sender: {
        id: 'user5',
        name: 'Lisa Chen',
      },
      timestamp: new Date('2024-01-04T15:05:00')
    }
  ]
}

export const mockOlafChat: GroupChat = {
  id: 'private2',
  name: 'Olaf',
  description: 'Private conversation with Olaf',
  imageUrl: '/icons/user.svg',
  messages: [
    {
      id: 'o1',
      content: 'Hey, I saw your question about ICD recovery in the main group.',
      sender: {
        id: 'user2',
        name: 'Olaf',
      },
      timestamp: new Date('2024-01-04T14:30:00')
    },
    {
      id: 'o2',
      content: 'Thanks for reaching out! Would love to hear more about your experience.',
      sender: {
        id: 'currentUser',
        name: 'You',
      },
      timestamp: new Date('2024-01-04T14:32:00')
    }
  ]
}

export const mockMariaChat: GroupChat = {
  id: 'private3',
  name: 'Maria',
  description: 'Private conversation with Maria',
  imageUrl: '/icons/user.svg',
  messages: [
    {
      id: 's1',
      content: 'Hi! I noticed you\'re new to the group. Welcome!',
      sender: {
        id: 'user6',
        name: 'Maria',
      },
      timestamp: new Date('2024-01-04T16:00:00')
    },
    {
      id: 's2',
      content: 'Thank you Maria! Yes, just joined yesterday.',
      sender: {
        id: 'currentUser',
        name: 'You',
      },
      timestamp: new Date('2024-01-04T16:05:00')
    }
  ]
} 
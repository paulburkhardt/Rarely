interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'support' | 'therapy' | 'clinics' | 'info';
  link?: string;
  location?: string;
  contact?: string;
}

export const resources: Resource[] = [
  {
    id: '1',
    title: 'ARVC Self Help Group',
    description: 'Learn more about ACM and connect with others affected by ACM in a supportive environment',
    category: 'support',
    link: 'https://acm-support.org',
    contact: 'contact@acm-support.org'
  },
  {
    id: '2',
    title: 'Psychological Support Services',
    description: 'Specialized counseling for individuals dealing with chronic conditions',
    category: 'therapy',
    location: 'Multiple locations available',
    contact: '+1 (555) 123-4567'
  },
  {
    id: '3',
    title: 'ACM Specialist Center',
    description: 'Leading center for ACM treatment and research',
    category: 'clinics',
    location: 'Johns Hopkins Hospital, Baltimore, MD',
    contact: '+1 (555) 987-6543'
  },
  {
    id: '4',
    title: 'Understanding ACM',
    description: 'Comprehensive guide to Arrhythmogenic Cardiomyopathy',
    category: 'info',
    link: 'https://acm-info.org/guide'
  }
] 
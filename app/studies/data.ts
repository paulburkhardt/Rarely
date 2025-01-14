export type Study = {
  id: string
  title: string
  purpose: string
  location: string
  startDate: Date
  totalSpots: number
  availableSpots: number
  status: 'recruiting' | 'running'
  progress?: number
  participants?: number
  hasApplied?: boolean
}

export const studies: Study[] = [
  {
    id: '1',
    title: 'Genetic Factors in ARVC',
    purpose: 'Investigating genetic mutations associated with arrhythmogenic right ventricular cardiomyopathy (ARVC)',
    location: 'Deutsches Herzzentrum, Munich, Germany',
    startDate: new Date('2024-03-15'),
    totalSpots: 50,
    availableSpots: 3,
    status: 'recruiting',
    hasApplied: false
  },
  {
    id: '2',
    title: 'Novel Treatment for ACM',
    purpose: 'Evaluating the efficacy of new medications in managing arrhythmogenic cardiomyopathy (ACM)',
    location: 'University Hospital, Heidelberg, Germany',
    startDate: new Date('2024-04-01'),
    totalSpots: 30,
    availableSpots: 12,
    status: 'recruiting',
    hasApplied: false
  },
  {
    id: '3',
    title: 'ACM and Exercise',
    purpose: 'Assessing the impact of different exercise regimens on ACM progression',
    location: 'Stanford University Medical Center, CA',
    startDate: new Date('2024-05-10'),
    totalSpots: 150,
    availableSpots: 112,
    status: 'running',
    progress: 65,
    participants: 150,
    hasApplied: false
  },
  {
    id: '4',
    title: 'Long-term ACM Outcomes',
    purpose: 'Studying long-term outcomes and quality of life in ACM patients',
    location: 'Cleveland Clinic, OH',
    startDate: new Date('2024-02-01'),
    totalSpots: 300,
    availableSpots: 0,
    status: 'running',
    progress: 45,
    participants: 300,
    hasApplied: false
  }
]
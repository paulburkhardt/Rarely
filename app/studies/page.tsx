'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users } from 'lucide-react'
import { colors } from "@/styles/colors"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"
import { studies } from './data'

type Study = {
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
/* 
const studies: Study[] = [
  {
    id: '1',
    title: 'Genetic Factors in ARVC',
    purpose: 'Investigating genetic mutations associated with arrhythmogenic right ventricular cardiomyopathy (ARVC)',
    location: 'Johns Hopkins Hospital, Baltimore, MD',
    startDate: new Date('2024-03-15'),
    totalSpots: 100,
    availableSpots: 37,
    status: 'recruiting',
    hasApplied: false
  },
  {
    id: '2',
    title: 'Novel Treatments for ACM',
    purpose: 'Evaluating the efficacy of new medications in managing arrhythmogenic cardiomyopathy (ACM)',
    location: 'Mayo Clinic, Rochester, MN',
    startDate: new Date('2024-04-01'),
    totalSpots: 200,
    availableSpots: 85,
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
] */

function StudiesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'recruiting'

  const handleTabChange = (value: string) => {
    router.push(`/studies?tab=${value}`)
  }

  const handleApply = (studyId: string) => {
    router.push(`/studies/apply/${studyId}`)
  }

  const filteredStudies = studies.filter(study => study.status === activeTab)

  return (
    <div className="min-h-[calc(100vh-5rem)]  p-4 md:p-8">
      <h1 className={`text-2xl md:text-3xl font-bold ${
        activeTab === 'running' ? 'text-[#1E4D57]' : 'text-[#473F63]'
      } mb-6`}>
        Research Studies
        <span className="block text-base font-normal ${
        activeTab === 'running' ? 'text-[#1E4D57]' : 'text-[#473F63]'
      } mt-2">
          Exploring Arrhythmogenic Cardiomyopathy
        </span>
      </h1>

      <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
        <TabsList className={`grid w-full grid-cols-2 rounded-xl p-1 ${
          activeTab === 'running' ? 'bg-[#DEEAE5]' : 'bg-[#E6E3FD]'
        }`}>
          <TabsTrigger 
            value="recruiting"
            className="rounded-lg data-[state=active]:bg-[#473F63] data-[state=active]:text-white transition-all duration-200"
          >
            Recruiting
          </TabsTrigger>
          <TabsTrigger 
            value="running"
            className="rounded-lg data-[state=active]:bg-[#1E4D57] data-[state=active]:text-white transition-all duration-200"
          >
            Running
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recruiting" className="space-y-4">
          {filteredStudies.map((study) => (
            <div 
              key={study.id} 
              className="border-b border-gray-300 pb-4"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex flex-col">
                  <h2 className="text-[#473F63] text-xl">
                    {study.title}
                  </h2>
                  {study.id === '1' && (
                    <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Matches your profile
                    </span>
                  )}
                </div>
                <Badge 
                  variant="secondary" 
                  className="w-fit bg-[#E6E3FD] text-[#473F63] font-medium"
                >
                  {study.availableSpots} spots left
                </Badge>
              </div>
              <p className="text-[#473F63]/90 text-sm mb-2 line-clamp-2">
                {study.purpose}
              </p>
              <div className="space-y-1 text-sm mb-4">
                <div className="flex items-center text-[#473F63]/80">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{study.location}</span>
                </div>
                <div className="flex items-center text-[#473F63]/80">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Starts: {study.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-[#473F63]/80">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {study.availableSpots} of {study.totalSpots} spots remaining
                  </span>
                </div>
              </div>
              {study.hasApplied ? (
                <div className="w-full bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-center font-medium">
                  Application Submitted
                </div>
              ) : (
                <button 
                  onClick={() => handleApply(study.id)}
                  className="w-full bg-[#473F63] text-white px-4 py-2 rounded-lg hover:bg-[#473F63]/90 transition-colors"
                >
                  Apply Now
                </button>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="running" className="space-y-4">
          {filteredStudies.map((study) => (
            <div 
              key={study.id} 
              className="border-b border-gray-300 pb-4"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-[#1E4D57] text-xl">
                  {study.title}
                </h2>
                <Badge 
                  variant="secondary" 
                  className="w-fit bg-[#DEEAE5] text-[#1E4D57] font-medium"
                >
                  {study.progress}% complete
                </Badge>
              </div>
              <p className="text-[#1E4D57]/90 text-sm mb-2 line-clamp-2">
                {study.purpose}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center text-[#1E4D57]/80">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{study.location}</span>
                </div>
                <div className="flex items-center text-[#1E4D57]/80">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Started: {study.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-[#1E4D57]/80">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {study.participants} participants enrolled
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-[#1E4D57] h-2.5 rounded-full" 
                    style={{ width: `${study.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function StudiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudiesContent />
    </Suspense>
  )
}


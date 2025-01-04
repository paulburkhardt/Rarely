'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users } from 'lucide-react'

type Study = {
  id: string
  title: string
  purpose: string
  location: string
  startDate: Date
  totalSpots: number
  availableSpots: number
}

const studies: Study[] = [
  {
    id: '1',
    title: 'Genetic Factors in ARVC',
    purpose: 'Investigating genetic mutations associated with arrhythmogenic right ventricular cardiomyopathy (ARVC)',
    location: 'Johns Hopkins Hospital, Baltimore, MD',
    startDate: new Date('2024-03-15'),
    totalSpots: 100,
    availableSpots: 37,
  },
  {
    id: '2',
    title: 'Novel Treatments for ACM',
    purpose: 'Evaluating the efficacy of new medications in managing arrhythmogenic cardiomyopathy (ACM)',
    location: 'Mayo Clinic, Rochester, MN',
    startDate: new Date('2024-04-01'),
    totalSpots: 200,
    availableSpots: 85,
  },
  {
    id: '3',
    title: 'ACM and Exercise',
    purpose: 'Assessing the impact of different exercise regimens on ACM progression',
    location: 'Stanford University Medical Center, CA',
    startDate: new Date('2024-05-10'),
    totalSpots: 150,
    availableSpots: 112,
  },
]

export default function StudiesPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white p-4">
      <h1 className="text-xl font-semibold text-[#473F63] mb-4">Studies for Arrhythmogenic Cardiomyopathy</h1>
      <div className="space-y-4">
        {studies.map((study) => (
          <Card key={study.id} className="bg-[#DEEAE5]">
            <CardHeader>
              <CardTitle className="text-[#473F63]">{study.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#1E4D57] mb-4">{study.purpose}</p>
              <div className="space-y-2">
                <div className="flex items-center text-[#473F63]">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{study.location}</span>
                </div>
                <div className="flex items-center text-[#473F63]">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Starts: {study.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-[#473F63]">
                  <Users className="w-5 h-5 mr-2" />
                  <span>
                    {study.availableSpots} of {study.totalSpots} spots available
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Badge 
                  variant="secondary" 
                  className="bg-[#E6E3FD] text-[#473F63]"
                >
                  {Math.round((study.availableSpots / study.totalSpots) * 100)}% spots left
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


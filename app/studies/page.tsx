'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Check } from 'lucide-react'
import { colors } from "@/styles/colors"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"
import { studies } from './data'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useUser } from "@/contexts/UserContext"


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



function StudiesContent() {
  const { userData } = useUser();
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams?.get('tab') ?? 'recruiting'

  const handleTabChange = (value: string) => {
    router.push(`/studies?tab=${value}`)
  }

  const handleApply = (studyId: string) => {
    router.push(`/studies/apply/${studyId}`)
  }

  const filteredStudies = studies.filter(study => study.status === activeTab)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E3D7F4] via-[#F7EED5] to-[#f8f8fa]">
      {/* Header */}
      <div className="p-6 pb-2">
        {/* Logo centered, Avatar right */}
        <div className="flex items-center relative mb-6">
          <div className="w-full flex justify-center">
            <Image 
              src="/logo_green.png" 
              alt="Logo" 
              width={100} 
              height={100} 
              className="opacity-90"
            />
          </div>
          <div className="absolute right-0">
            <Avatar className="h-8 w-8">
              <AvatarImage alt="User avatar" />
              <AvatarFallback>{userData?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-black mb-1">Studies</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24 space-y-4">
        <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-white/95 shadow-sm backdrop-blur-sm">
            <TabsTrigger 
              value="recruiting"
              className="rounded-lg data-[state=active]:bg-[#3a2a76] data-[state=active]:text-white transition-all duration-200"
            >
              Recruiting
            </TabsTrigger>
            <TabsTrigger 
              value="running"
              className="rounded-lg data-[state=active]:bg-[#3a2a76] data-[state=active]:text-white transition-all duration-200"
            >
              Running
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recruiting" className="space-y-4">
            {filteredStudies.map((study) => (
              <Card key={study.id} className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold text-[#3a2a76]">
                        {study.title}
                      </h2>
                      {study.id === '1' && (
                        <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 mt-1">
                          <Check className="w-4 h-4" />
                          Matches your profile
                        </span>
                      )}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute top-0 right-0 bg-[#E3D7F4] text-[#3a2a76] font-medium"
                    >
                      {study.availableSpots} spots left
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {study.purpose}
                  </p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{study.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Starts: {study.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
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
                    <Button 
                      onClick={() => handleApply(study.id)}
                      className="w-full bg-[#3a2a76] hover:bg-[#a680db] text-white transition-colors"
                    >
                      Apply Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="running" className="space-y-4">
            {filteredStudies.map((study) => (
              <Card key={study.id} className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-[#3a2a76]">
                      {study.title}
                    </h2>
                    <Badge 
                      variant="secondary" 
                      className="bg-[#E3D7F4] text-[#3a2a76] font-medium"
                    >
                      {study.progress}% complete
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {study.purpose}
                  </p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{study.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Started: {study.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="font-medium">
                        {study.participants} participants enrolled
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-[#3a2a76] h-2.5 rounded-full" 
                        style={{ width: `${study.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
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


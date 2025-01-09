'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, ExternalLink } from 'lucide-react'
import { resources } from '@/data/mock-resources'

export default function ResourcesPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#473F63] mb-6">
        ACM Resources
        <span className="block text-base font-normal text-[#473F63]/80 mt-2">
          Support, Information & Care
        </span>
      </h1>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div 
            key={resource.id} 
            className="border-b border-gray-200 pb-4"
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-[#473F63] text-xl">
                {resource.title}
              </h2>
              <Badge 
                variant="secondary" 
                className="w-fit bg-[#E6E3FD] text-[#473F63] font-medium capitalize"
              >
                {resource.category}
              </Badge>
            </div>
            <p className="text-[#473F63]/90 text-sm mb-2">
              {resource.description}
            </p>
            <div className="space-y-1 text-sm">
              {resource.location && (
                <div className="flex items-center text-[#473F63]/80">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{resource.location}</span>
                </div>
              )}
              {resource.contact && (
                <div className="flex items-center text-[#473F63]/80">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{resource.contact}</span>
                </div>
              )}
              {resource.link && (
                <a 
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#473F63] hover:text-[#473F63]/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
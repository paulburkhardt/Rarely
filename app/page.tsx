"use client"

import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from 'lucide-react'
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-6 text-[#473F63]">
        <div className="flex items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage alt="User avatar" />
            <AvatarFallback>Fe</AvatarFallback>
          </Avatar>
          <span className="text-sm ml-2">Fe</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Streak:</span>
          <span className="text-sm font-bold">7</span>
          <span>🔥</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 pt-0">
        <Dashboard />
      </main>
    </div>
  )
}


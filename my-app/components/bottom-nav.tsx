"use client"


import { Home, BookOpen, User, Search } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const getLinkStyle = (path: string) => {
    return isActive(path) 
      ? { color: '#E6E3FD', backgroundColor: '#473F63' }
      : { color: '#473F63' }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#E6E3FD] border-t border-gray-200">
      <div className="flex justify-around items-center h-20 px-6 max-w-md mx-auto">
        <Link 
          href="/" 
          className="flex flex-col items-center rounded-lg px-4 py-2"
          style={getLinkStyle('/')}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link 
          href="/forum" 
          className="flex flex-col items-center rounded-lg px-4 py-2"
          style={getLinkStyle('/forum')}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs mt-1">Forum</span>
        </Link>
        <Link 
          href="/chat" 
          className="flex flex-col items-center rounded-lg px-4 py-2"
          style={getLinkStyle('/chat')}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Assistant</span>
        </Link>
        <Link 
          href="/studies" 
          className="flex flex-col items-center rounded-lg px-4 py-2"
          style={getLinkStyle('/studies')}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Studies</span>
        </Link>
      </div>
    </div>
  )
}


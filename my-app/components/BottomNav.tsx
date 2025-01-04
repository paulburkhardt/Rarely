"use client"

import Link from "next/link";
import { ScrollText, MessageCircle, Users, BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${pathname === '/' ? 'text-blue-500' : 'text-gray-600'}`}>
          <ScrollText className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link href="/empty" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${pathname === '/empty' ? 'text-blue-500' : 'text-gray-600'}`}>
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        <Link href="/empty" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${pathname === '/empty' ? 'text-blue-500' : 'text-gray-600'}`}>
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Forum</span>
        </Link>
        <Link href="/empty" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${pathname === '/empty' ? 'text-blue-500' : 'text-gray-600'}`}>
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">Studies</span>
        </Link>
      </div>
    </nav>
  )
} 
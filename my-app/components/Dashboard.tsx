"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { colors } from "@/styles/colors";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [hasDiaryEntry, setHasDiaryEntry] = useState<boolean>(false);

  useEffect(() => {
    const diaryEntryStatus = sessionStorage.getItem("hasDiaryEntry");
    if (diaryEntryStatus === "true") {
      setHasDiaryEntry(true);
    }
  }, []);

  const handleDiaryClick = () => {
    setHasDiaryEntry(true);
    sessionStorage.setItem("hasDiaryEntry", "true");
  };
    

  // Sample streak data - replace with your actual data
  const currentDate = new Date();
  const weekDates = Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(currentDate.getDate() - (6 - i));
    return {
      day: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()],
      date: date.getDate(),
      hasStreak: i >= 5 // Example: last 2 days have streaks
    };
  });

  return (
    <div className="space-y-6">
        {/* App Name */}
        <div className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center items-center py-6">
            <Image 
              src="/logo_purple.png" 
              alt="Logo" 
              width={140}
              height={140}
              priority
            />
          </div>
          <h2 className="text-xl font-medium text-[#473F63]">
            Welcome to rarely Fe!
          </h2>
          <p className="text-[#473F63] opacity-80">
            You haven&apos;t filled out your diary yet!
          </p>
        </div>
        
        {!hasDiaryEntry && (
          <Card className="bg-[#E6E3FD] border-none shadow-none">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-8 h-8">
                <BookOpen className="w-full h-full text-[#473F63]" />
              </div>
              <p className="text-[#473F63]">
                To understand your disease better we need to track your habits!
              </p>
              <Button 
                className="bg-[#473F63] hover:bg-[#473F63]/90 text-white"
                onClick={handleDiaryClick}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}
      <main className="container mx-auto px-4 py-8">
        {/* Header Section with Streak Count */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Good Afternoon.</h2>
            <h3 className="text-gray-500">5. January</h3>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <span className="text-xl">🔥</span>
            <span className="font-medium">2</span>
          </div>
        </div>

        {/* Calendar Strip with Streaks */}
        <div className="flex justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm">
          {weekDates.map((item) => (
            <div key={item.day} className="text-center">
              <div className="text-sm text-gray-400">{item.day}</div>
              <div className="text-sm text-gray-600 mb-1">{item.date}</div>
              {item.hasStreak ? (
                <div className="w-2 h-2 bg-black rounded-full mx-auto" />
              ) : (
                <div className="w-2 h-2 bg-gray-200 rounded-full mx-auto" />
              )}
            </div>
          ))}
        </div>

        {/* Collective Progress & Impact Stats */}
        <div className="space-y-6 mb-8">
          {/* Gentherapies Card - Full Width */}
          <Card className="bg-white shadow-sm border-none rounded-2xl p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-medium">Our Collective Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <div className="text-2xl font-medium">2</div>
              <div className="text-sm text-gray-400">Gentherapies initiated</div>
            </CardContent>
          </Card>

          {/* Journal Entries and Daily Users - Two Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white shadow-sm border-none rounded-2xl p-6">
              <CardContent className="p-0">
                <div className="text-2xl font-medium">200</div>
                <div className="text-sm text-gray-400">Journal Entries</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-none rounded-2xl p-6">
              <CardContent className="p-0">
                <div className="text-2xl font-medium">20</div>
                <div className="text-sm text-gray-400">Daily Users and growing</div>
                <div className="text-xs text-gray-400">yesterday</div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Streaks and Total Entries - Two Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white shadow-sm border-none rounded-2xl p-6">
              <CardContent className="p-0">
                <div className="text-2xl font-medium">4</div>
                <div className="text-sm text-gray-400">Daily Streaks</div>
                <div className="text-xs text-gray-400">Consistency is key!</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-none rounded-2xl p-6">
              <CardContent className="p-0">
                <div className="text-2xl font-medium">200</div>
                <div className="text-sm text-gray-400">Total Entries</div>
                <div className="text-xs text-gray-400">Impressive milestone!</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <Link href="/" className="text-center">
              <div className="w-6 h-6 bg-black rounded-full mx-auto mb-1" />
              <span className="text-xs text-gray-900">Today</span>
            </Link>
            <Link href="/library" className="text-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1" />
              <span className="text-xs text-gray-400">Library</span>
            </Link>
            <Link href="/journey" className="text-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1" />
              <span className="text-xs text-gray-400">Journey</span>
            </Link>
            <Link href="/trends" className="text-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1" />
              <span className="text-xs text-gray-400">Trends</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


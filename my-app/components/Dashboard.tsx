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
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { BarChart } from "@/components/ui/bar-chart";
import { Calendar, MessageCircle, Activity, Clock } from 'lucide-react';

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

  // Sample data for charts
  const moodData = [
    { day: "Mon", value: 3 },
    { day: "Tue", value: 4 },
    { day: "Wed", value: 2 },
    { day: "Thu", value: 5 },
    { day: "Fri", value: 4 },
    { day: "Sat", value: 3 },
    { day: "Sun", value: 4 },
  ];

  const symptomsData = [
    { name: "Fatigue", value: 4 },
    { name: "Pain", value: 2 },
    { name: "Stiffness", value: 3 },
  ];

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
        {/* Personal Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Mood Tracking */}
          <Card className="bg-[#E6E3FD] border-none rounded-2xl p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-[#473F63] text-lg">Your Mood This Week</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodData}>
                  <Line type="monotone" dataKey="value" stroke="#473F63" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Symptoms Overview */}
          <Card className="bg-[#DEEAE5] border-none rounded-2xl p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-[#1E4D57] text-lg">Current Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <BarChart data={symptomsData} />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Study & Forum Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Next Study Appointment */}
          <Card className="bg-[#E6E3FD] border-none rounded-2xl p-6">
            <CardHeader className="p-0 flex flex-row items-center gap-4">
              <Clock className="w-6 h-6 text-[#473F63]" />
              <CardTitle className="text-[#473F63] text-lg">Next Appointment</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <div className="text-[#473F63]">
                <p className="font-medium">Gene Therapy Study - Phase 2</p>
                <p>January 15th, 2024 - 10:00 AM</p>
                <Button className="mt-4 bg-[#473F63] text-white">View Details</Button>
              </div>
            </CardContent>
          </Card>

          {/* Trending Forum Post */}
          <Card className="bg-[#DEEAE5] border-none rounded-2xl p-6">
            <CardHeader className="p-0 flex flex-row items-center gap-4">
              <MessageCircle className="w-6 h-6 text-[#1E4D57]" />
              <CardTitle className="text-[#1E4D57] text-lg">Trending Discussion</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <Link href="/forum/chat/1" className="block">
                <p className="font-medium text-[#1E4D57]">New Treatment Breakthrough</p>
                <p className="text-sm text-[#1E4D57]/80">Join 45 others discussing the latest research...</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-[#1E4D57]/60">
                  <span>💬 23 replies</span>
                  <span>• 2h ago</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Matching Study */}
        <Card className="bg-[#E6E3FD] border-none rounded-2xl p-6 mb-8">
          <CardHeader className="p-0">
            <CardTitle className="text-[#473F63] text-lg">Recommended Study Match</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="space-y-4">
              <p className="text-[#473F63]">Based on your profile: Gene Therapy Trial XYZ-123</p>
              <div className="flex gap-4">
                <Button className="bg-[#473F63] text-white">Apply Now</Button>
                <Button variant="outline" className="border-[#473F63] text-[#473F63]">Learn More</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Progress Section */}
        <Card className="bg-[#DEEAE5] border-none rounded-2xl p-6 mb-20">
          <CardHeader className="p-0">
            <CardTitle className="text-[#1E4D57] text-lg">Community Impact</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-medium text-[#1E4D57]">2,450</div>
                <div className="text-sm text-[#1E4D57]/80">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-[#1E4D57]">156</div>
                <div className="text-sm text-[#1E4D57]/80">Studies Joined</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-[#1E4D57]">89%</div>
                <div className="text-sm text-[#1E4D57]/80">Diary Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-[#1E4D57]">12</div>
                <div className="text-sm text-[#1E4D57]/80">Research Papers</div>
              </div>
            </div>
          </CardContent>
        </Card>

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


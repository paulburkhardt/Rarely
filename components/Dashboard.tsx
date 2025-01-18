"use client"

import React, { useState, useEffect, cloneElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { colors } from "@/styles/colors";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";
import { BarChart } from "@/components/ui/bar-chart";
import { Calendar, MessageCircle, Activity, Clock, AppleIcon, Check, Heart, Grid, Pill, ClipboardCheck, Smile, Download, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus, Frown, Meh, Dumbbell, Footprints, Bike, Coffee, Bed } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/contexts/UserContext"
import { mockData } from "@/data/mock-data";
import { studies } from "@/app/studies/data";

interface Activity {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

interface Symptom {
  label: string;
  selected: boolean;
}

interface Medication {
  name: string;
  taken: boolean;
  prescribed: boolean;
  category: string;
}

interface ActivityDataPoint {
  time: string;
  value: number;
  activity: string;
}

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [hasDiaryEntry, setHasDiaryEntry] = useState<boolean>(false);
  const [isHealthSynced, setIsHealthSynced] = useState<boolean>(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [mood, setMood] = useState<number>(2);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { label: "Palpitations", selected: false },
    { label: "Extra Heartbeats", selected: false },
    { label: "Rapid Heartbeat", selected: false },
    { label: "Shortness of Breath", selected: false },
    { label: "Chest Pain/Discomfort", selected: false },
    { label: "Dizziness", selected: false },
    { label: "Loss of Consciousness", selected: false },
    { label: "Fatigue", selected: false },
  ]);
  const [medications, setMedications] = useState<Medication[]>([
    // Antiarrhythmic drugs
    { name: "Sotalol", taken: false, prescribed: true, category: "Antiarrhythmic" },
    { name: "Amiodarone", taken: false, prescribed: false, category: "Antiarrhythmic" },
    { name: "Flecainide", taken: false, prescribed: false, category: "Antiarrhythmic" },
    
    // Beta blockers
    { name: "Bisoprolol", taken: false, prescribed: true, category: "Beta Blocker" },
    { name: "Metoprolol", taken: false, prescribed: false, category: "Beta Blocker" },
    
    // Heart failure drugs
    { name: "ACE Inhibitor", taken: false, prescribed: true, category: "Heart Failure" },
    { name: "Entresto (Sacubitril/Valsartan)", taken: false, prescribed: true, category: "Heart Failure" },
    { name: "Eplerenon", taken: false, prescribed: false, category: "Heart Failure" },
    { name: "Finerenon", taken: false, prescribed: false, category: "Heart Failure" },
    
    // Diuretics
    { name: "Furosemide", taken: false, prescribed: false, category: "Diuretic" },
    { name: "Torasemide", taken: false, prescribed: false, category: "Diuretic" },
    
    // SGLT2 Inhibitors
    { name: "SGLT2 Inhibitor", taken: false, prescribed: false, category: "SGLT2" },
  ]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [newSymptom, setNewSymptom] = useState<string>("");
  const [showSymptomInput, setShowSymptomInput] = useState(false);
  const [newMedication, setNewMedication] = useState<string>("");
  const [showMedicationInput, setShowMedicationInput] = useState(false);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");
  const [activityData, setActivityData] = useState({
    today: [
      { time: '9AM', value: 1, activity: 'Complete Rest' },
      { time: '11AM', value: 2, activity: 'Daily Activities' },
      { time: '1PM', value: 3, activity: 'Light Exercise' },
      { time: '3PM', value: 4, activity: 'Moderate Exercise' },
      { time: '5PM', value: 2, activity: 'Daily Activities' },
      { time: '7PM', value: 3, activity: 'Light Exercise' },
      { time: '9PM', value: 1, activity: 'Complete Rest' },
    ],
    week: [
      { time: 'Mon', value: 2, activity: 'Daily Activities' },
      { time: 'Tue', value: 3, activity: 'Light Exercise' },
      { time: 'Wed', value: 4, activity: 'Moderate Exercise' },
      { time: 'Thu', value: 2, activity: 'Daily Activities' },
      { time: 'Fri', value: 3, activity: 'Light Exercise' },
      { time: 'Sat', value: 1, activity: 'Complete Rest' },
      { time: 'Sun', value: 2, activity: 'Daily Activities' },
    ],
    month: [
      { time: 'Week 1', value: 2, activity: 'Daily Activities' },
      { time: 'Week 2', value: 3, activity: 'Light Exercise' },
      { time: 'Week 3', value: 4, activity: 'Moderate Exercise' },
      { time: 'Week 4', value: 2, activity: 'Daily Activities' },
    ],
  });

  const { userData, setUserData } = useUser();

  const activities: Activity[] = [
    { icon: <Bed size={24} />, label: "Complete Rest", value: "rest" },
    { icon: <Coffee size={24} />, label: "Daily Activities", value: "daily" },
    { icon: <Footprints size={24} />, label: "Light Exercise", value: "light" },
    { icon: <Dumbbell size={24} />, label: "Moderate Exercise", value: "moderate" },
    { icon: <Bike size={24} />, label: "Intense Exercise", value: "intense" },
  ];

  useEffect(() => {
    const diaryEntryStatus = sessionStorage.getItem("hasDiaryEntry");
    if (diaryEntryStatus === "true") {
      setHasDiaryEntry(true);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData({ name: parsedData.name || 'user' });
    }
  }, [setUserData]);

  const handleDiaryClick = () => {
    setShowDiaryModal(true);
  };

  // Sample data for charts
  const moodData = [
    { time: '9AM', value: isHealthSynced ? 4 : 3 },
    { time: '11AM', value: isHealthSynced ? 3 : 4 },
    { time: '1PM', value: isHealthSynced ? 4 : 2 },
    { time: '3PM', value: isHealthSynced ? 5 : 5 },
    { time: '5PM', value: isHealthSynced ? 3 : 4 },
    { time: '7PM', value: isHealthSynced ? 4 : 3 },
    { time: '9PM', value: isHealthSynced ? 5 : 4 },
  ];

  const symptomsData = [
    { name: "Fatigue", value: isHealthSynced ? 3 : 4 },
    { name: "Pain", value: isHealthSynced ? 2 : 2 },
    { name: "Stiffness", value: isHealthSynced ? 2 : 3 },
    { name: "Sleep", value: isHealthSynced ? 4 : 0 },
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

  // Add this mock data for synced state
  const syncedActivityData = {
    today: [
      { time: '9AM', value: 2, activity: 'Daily Activities' },
      { time: '11AM', value: 3, activity: 'Light Exercise' },
      { time: '1PM', value: 2, activity: 'Daily Activities' },
      { time: '3PM', value: 4, activity: 'Moderate Exercise' },
      { time: '5PM', value: 5, activity: 'Intense Exercise' },
      { time: '7PM', value: 2, activity: 'Daily Activities' },
      { time: '9PM', value: 1, activity: 'Complete Rest' },
    ],
    week: [
      { time: 'Mon', value: 3, activity: 'Light Exercise' },
      { time: 'Tue', value: 4, activity: 'Moderate Exercise' },
      { time: 'Wed', value: 5, activity: 'Intense Exercise' },
      { time: 'Thu', value: 3, activity: 'Light Exercise' },
      { time: 'Fri', value: 4, activity: 'Moderate Exercise' },
      { time: 'Sat', value: 2, activity: 'Daily Activities' },
      { time: 'Sun', value: 3, activity: 'Light Exercise' },
    ],
    month: [
      { time: 'Week 1', value: 3, activity: 'Light Exercise' },
      { time: 'Week 2', value: 4, activity: 'Moderate Exercise' },
      { time: 'Week 3', value: 5, activity: 'Intense Exercise' },
      { time: 'Week 4', value: 3, activity: 'Light Exercise' },
    ],
  };

  const handleHealthSync = () => {
    setIsHealthSynced(true);
    // Update the activity data with synced data
    setActivityData(syncedActivityData);
    // In a real app, this would trigger the Apple Health API integration
  };

  const submitDiary = () => {
    setHasDiaryEntry(true);
    sessionStorage.setItem("hasDiaryEntry", "true");
    setShowDiaryModal(false);
    // Here you would typically save the diary entry to your backend
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "How are you feeling today?";
      case 2: return "What activities did you do?";
      case 3: return "Any symptoms today?";
      case 4: return "Track your medications";
      default: return "";
    }
  };

  const generateICalEvent = (appointment: any) => {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${new Date('2024-01-15T10:00:00').toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${new Date('2024-01-15T11:00:00').toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'SUMMARY:Gene Therapy - Ph.2',
      'DESCRIPTION:Your scheduled gene therapy appointment',
      'LOCATION:Medical Center',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'appointment.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E3D7F4] via-[#F7EED5] to-[#f8f8fa]">
      {/* Header - Updated layout */}
      <div className="p-6">
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
         
        </div>

        {/* Centered Greeting */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-black">Hello {userData.name}.</h1>
        </div>
      </div>

      {/* Main Content - Adjusted spacing */}
      <div className="px-4 pb-24 space-y-4">
        {/* Daily Overview Cards */}
        <div className="space-y-4">
          {/* Mental Wellbeing Card */}
          <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#3a2a76]" />
                  </div>
                  <span className="font-semibold text-base">Daily Diary</span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {hasDiaryEntry ? "A Slightly Pleasant Moment" : "Let's check in to get your daily data"}
                  </h3>
                  
                    
                    {hasDiaryEntry && <div className="flex items-center gap-2"><span className="text-sm text-gray-500">Today's Entry</span> 
                    <Badge variant="secondary">Updated</Badge></div>}
              
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  mood === 3 
                    ? 'bg-green-100' 
                    : mood === 2 
                    ? 'bg-yellow-100' 
                    : 'bg-red-100'
                }`}>
                  {mood === 3 ? (
                    <Smile className="w-6 h-6 text-green-500" />
                  ) : mood === 2 ? (
                    <Meh className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <Frown className="w-6 h-6 text-red-500" />
                  )}
                </div>
              </div>

              <Button 
                className="w-full bg-[#3a2a76] hover:bg-[#a680db] text-white font-medium h-12 rounded-xl"
                onClick={handleDiaryClick}
              >
                {hasDiaryEntry ? "Update Check-in" : "Start Check-in"}
              </Button>
            </div>
          </Card>

          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-3">
            {/* Symptoms Card */}
            <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-2xl p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Heart className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {symptoms.filter(s => s.selected).length}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">Symptoms</p>
                </div>
              </div>
            </Card>

            {/* Medications Card */}
            <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-2xl p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Pill className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {medications.filter(m => m.taken).length}/{medications.length}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">Medications</p>
                </div>
              </div>
            </Card>

            {/* Activity Level Card */}
            <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-2xl p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Activity className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold truncate">
                    {selectedActivity ? activities.find(a => a.value === selectedActivity)?.label.split(' ')[0] : 'None'}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">Activity</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Activity Tracking */}
        <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 ">
                <div className="w-8 h-8 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#3a2a76]" />
                </div>
                <span className="font-semibold text-lg">Activity</span>
              </div>
              <div className="flex items-center gap-1 ml-1">
                <Button 
                  size="sm"
                  variant="ghost" 
                  className={`text-[#3a2a76]  ${!isHealthSynced ? 'bg-gray-100' : 'bg-gray-200'} font-medium`}
                  onClick={handleHealthSync}
                >
                  <AppleIcon className="w-4 h-4" />
                  {isHealthSynced ? "Connected" : "Connect"}
                </Button>
                <Select value={timeRange} onValueChange={(value: "today" | "week" | "month") => setTimeRange(value)}>
                  <SelectTrigger className="bg-transparent border-none text-[#3a2a76] font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData[timeRange]} margin={{ top: 5, right: 5, bottom: 5, left: -40 }}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3a2a76" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3a2a76" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="#E5E5EA"
                  />
                  <XAxis 
                    dataKey="time" 
                    stroke="#8E8E93"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#8E8E93"
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      padding: '8px 12px',
                    }}
                    labelStyle={{
                      color: '#3A3A3C',
                      fontWeight: '500',
                      fontSize: '13px',
                      marginBottom: '4px',
                    }}
                    itemStyle={{
                      color: '#636366',
                      fontSize: '12px',
                      padding: '0',
                    }}
                    formatter={(value: number, name: string, props: any) => {
                      const activityLabels = {
                        1: 'Complete Rest',
                        2: 'Daily Activities',
                        3: 'Light Exercise',
                        4: 'Moderate Exercise',
                        5: 'Intense Exercise'
                      };
                      return [activityLabels[value as keyof typeof activityLabels], ''];
                    }}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3a2a76"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#activityGradient)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3a2a76" 
                    strokeWidth={2}
                    dot={{ 
                      fill: '#FFFFFF',
                      stroke: '#3a2a76',
                      strokeWidth: 2,
                      r: 4
                    }}
                    activeDot={{ 
                      r: 6,
                      stroke: '#3a2a76',
                      strokeWidth: 2,
                      fill: '#FFFFFF'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Average Activity Level</span>
                <span className="font-medium">
                  {Math.round(activityData[timeRange].reduce((acc, curr) => acc + curr.value, 0) / activityData[timeRange].length * 10) / 10}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold px-1">Upcoming</h2>
          
          {/* Next Appointment */}
          <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Gene Therapy - Ph.2</p>
                    <p className="text-sm text-gray-500">Jan 15, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-[#007AFF] border-[#007AFF] hover:bg-[#007AFF]/10"
                    onClick={() => generateICalEvent({})}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Match */}
          {studies.find(study => study.matches) && (
            <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">New Study Match</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Info className="w-4 h-4 text-[#3a2a76]" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                          <DialogHeader>
                            <DialogTitle>{studies.find(study => study.matches)?.title}</DialogTitle>
                            <DialogDescription>
                              <div className="space-y-4">
                                <p>{studies.find(study => study.matches)?.explanation}</p>
                               
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {studies.find(study => study.matches)?.title}
                    </p>
                  </div>
                </div>
                <Link href={`/studies/apply/${studies.find(study => study.matches)?.id}`}>
                  <Button size="sm" className="w-full bg-[#3a2a76] hover:bg-[#a680db]">
                    Apply
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Community Section */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold px-1">Trending</h2>
          
          {/* Trending Discussion */}
          <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl">
            <Link href={`/forum/chat/${mockData.groups[0].id}`} className="block p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{mockData.groups[0].name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {mockData.groups[0].unreadCount} new
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Join {mockData.groups[0].memberCount} others discussing {mockData.groups[0].description.toLowerCase()}...
                  </p>
                </div>
              </div>
            </Link>
          </Card>

          {/* Community Stats */}
          <div className="space-y-4">
          <h2 className="text-base font-semibold px-1">Community Stats</h2>
          <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl">

            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">43</div>
                  <div className="text-xs text-gray-500">Active Users</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">1</div>
                  <div className="text-xs text-gray-500">Therapies facilitated</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">7</div>
                  <div className="text-xs text-gray-500">Journal Entries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      {/* Bottom Navigation - Added slight blur effect */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t">
        <div className="flex justify-around items-center py-2">
          <Link href="/" className="flex flex-col items-center p-2">
            <Heart className="w-6 h-6 text-[#3a2a76]" />
            <span className="text-xs font-medium">Summary</span>
          </Link>
          <Link href="/sharing" className="flex flex-col items-center p-2">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Sharing</span>
          </Link>
          <Link href="/browse" className="flex flex-col items-center p-2">
            <Grid className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Browse</span>
          </Link>
        </div>
      </div>

      <Dialog open={showDiaryModal} onOpenChange={(open) => {
        setShowDiaryModal(open);
        if (!open) setCurrentStep(1);
      }}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] flex flex-col bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-semibold text-center">
              {getStepTitle(currentStep)}
            </DialogTitle>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {/* Step 1: Mood */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4">
                  {[
                    { icon: <Frown />, value: 1, label: "Not Good", color: "text-red-500" },
                    { icon: <Meh />, value: 2, label: "Okay", color: "text-yellow-500" },
                    { icon: <Smile />, value: 3, label: "Good", color: "text-green-500" }
                  ].map((item) => (
                    <div 
                      key={item.value}
                      className={`flex flex-col items-center gap-3 cursor-pointer transition-all transform ${
                        mood === item.value 
                          ? 'scale-110' 
                          : 'opacity-50 hover:opacity-75 hover:scale-105'
                      }`}
                      onClick={() => setMood(item.value)}
                    >
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                        mood === item.value 
                          ? `${item.color} bg-white shadow-lg` 
                          : 'text-gray-300 bg-gray-50'
                      }`}>
                        {cloneElement(item.icon, { className: 'w-12 h-12' } as { className: string })}
                      </div>
                      <span className={`text-sm font-medium ${
                        mood === item.value ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Activity */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.value}
                      className={`relative rounded-2xl p-6 cursor-pointer transition-all ${
                        selectedActivity === activity.value
                          ? 'bg-[#3a2a76]/10 border-2 border-[#3a2a76]'
                          : 'bg-white/80 border-2 border-transparent hover:border-[#3a2a76]/30 hover:bg-white'
                      }`}
                      onClick={() => setSelectedActivity(activity.value)}
                    >
                      {selectedActivity === activity.value && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-[#3a2a76] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedActivity === activity.value 
                            ? 'bg-[#3a2a76]/20' 
                            : 'bg-gray-100'
                        }`}>
                          {cloneElement(activity.icon, { 
                            className: `w-6 h-6 ${
                              selectedActivity === activity.value 
                                ? 'text-[#3a2a76]' 
                                : 'text-gray-500'
                            }`
                          })}
                        </div>
                        <span className={`text-sm font-medium text-center ${
                          selectedActivity === activity.value 
                            ? 'text-[#3a2a76]' 
                            : 'text-gray-600'
                        }`}>
                          {activity.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Symptoms */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {symptoms.map((symptom, index) => (
                    <div
                      key={symptom.label}
                      className={`relative rounded-2xl p-4 cursor-pointer transition-all ${
                        symptom.selected
                          ? 'bg-[#3a2a76]/10 border-2 border-[#3a2a76]'
                          : 'bg-white/80 border-2 border-transparent hover:border-[#3a2a76]/30 hover:bg-white'
                      }`}
                      onClick={() => {
                        const newSymptoms = [...symptoms];
                        newSymptoms[index].selected = !newSymptoms[index].selected;
                        setSymptoms(newSymptoms);
                      }}
                    >
                      {symptom.selected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 bg-[#3a2a76] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <span className={`text-sm font-medium ${
                        symptom.selected ? 'text-[#3a2a76]' : 'text-gray-600'
                      }`}>
                        {symptom.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                {showSymptomInput ? (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      placeholder="Enter symptom name"
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50 focus:border-[#3a2a76]"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (newSymptom.trim()) {
                            setSymptoms([...symptoms, { label: newSymptom.trim(), selected: true }]);
                            setNewSymptom("");
                            setShowSymptomInput(false);
                          }
                        }}
                        className="flex-1 bg-[#3a2a76] hover:bg-[#a680db]"
                      >
                        Add Symptom
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewSymptom("");
                          setShowSymptomInput(false);
                        }}
                        className="border-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 border-2 border-dashed"
                    onClick={() => setShowSymptomInput(true)}
                  >
                    <Plus className="w-4 h-4" /> Add Custom Symptom
                  </Button>
                )}
              </div>
            )}

            {/* Step 4: Medications - Updated UI with categories */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Group medications by category */}
                {Array.from(new Set(medications.map(med => med.category))).map(category => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-500">{category}</h3>
                    <div className="space-y-2">
                      {medications
                        .filter(med => med.category === category)
                        .map((med, index) => (
                          <div
                            key={med.name}
                            className={`relative rounded-xl p-4 transition-all ${
                              med.taken
                                ? 'bg-primary/10 border-2 border-primary'
                                : 'bg-gray-50 border-2 border-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="font-medium">{med.name}</span>
                                {med.prescribed && (
                                  <Badge variant="secondary" className="text-xs">Prescribed</Badge>
                                )}
                              </div>
                              <Button
                                variant={med.taken ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const newMeds = [...medications];
                                  const medIndex = medications.findIndex(m => m.name === med.name);
                                  newMeds[medIndex].taken = !newMeds[medIndex].taken;
                                  setMedications(newMeds);
                                }}
                              >
                                {med.taken ? "✓ Taken" : "Mark as Taken"}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
                
                {/* Add Custom Medication UI */}
                {showMedicationInput ? (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Enter medication name"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Select defaultValue="Antiarrhythmic">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Antiarrhythmic">Antiarrhythmic</SelectItem>
                        <SelectItem value="Beta Blocker">Beta Blocker</SelectItem>
                        <SelectItem value="Heart Failure">Heart Failure</SelectItem>
                        <SelectItem value="Diuretic">Diuretic</SelectItem>
                        <SelectItem value="SGLT2">SGLT2 Inhibitor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (newMedication.trim()) {
                            setMedications([
                              ...medications,
                              { 
                                name: newMedication.trim(), 
                                taken: true, 
                                prescribed: false,
                                category: "Other" // You might want to make this dynamic based on selection
                              }
                            ]);
                            setNewMedication("");
                            setShowMedicationInput(false);
                          }
                        }}
                        className="flex-1"
                      >
                        Add Medication
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewMedication("");
                          setShowMedicationInput(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => setShowMedicationInput(true)}
                  >
                    <Plus className="w-4 h-4" /> Add Medication
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Footer with updated styling */}
          <div className="flex-shrink-0 pt-6 border-t mt-6">
            <div className="flex justify-between items-center px-2 mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      step === currentStep
                        ? 'bg-[#3a2a76] scale-125'
                        : step < currentStep
                        ? 'bg-[#3a2a76]/50'
                        : 'bg-gray-200'
                    }`}
                  />
                  <span className={`text-xs ${
                    step === currentStep ? 'text-[#3a2a76] font-medium' : 'text-gray-400'
                  }`}>
                    Step {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 border-2"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={() => {
                  if (currentStep < 4) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    submitDiary();
                  }
                }}
                className="flex-1 bg-[#3a2a76] hover:bg-[#a680db]"
              >
                {currentStep < 4 ? 'Continue' : 'Complete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }
      `}</style>
    </div>
  );
}


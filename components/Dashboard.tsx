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
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { BarChart } from "@/components/ui/bar-chart";
import { Calendar, MessageCircle, Activity, Clock, AppleIcon, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus, Smile, Frown, Meh, Dumbbell, Footprints, Bike, Coffee, Bed } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Activity {
  icon: React.ReactNode;
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
  const [userData, setUserData] = useState<{name: string}>({ name: '' });

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
      setUserData({ name: parsedData.name });
    }
  }, []);

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

  return (
    <>
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-6 pb-0 text-[#473F63]">
        <div className="flex items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage alt="User avatar" />
            <AvatarFallback>{userData.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm ml-2">{userData.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Streak:</span>
          <span className="text-sm font-bold">7</span>
          <span>🔥</span>
        </div>
      </div>

      <div className="space-y-4 p-6 pt-0">
        {/* App Name */}
        <div className="text-center space-y-0">
          {/* Logo */}
          <div className="flex justify-center items-center pt-2 pb-3">
            <Image 
              src="/logo_purple.png" 
              alt="Logo" 
              width={100}
              height={100}
              priority
            />
          </div>
          <h2 className="text-lg font-medium text-[#473F63]">
            Welcome to rarely {userData.name}!
          </h2>
        </div>
        
        <Card className="bg-[#473F63] border-none shadow-none">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-8 h-8">
              <BookOpen className="w-full h-full text-white" />
            </div>
            <p className="text-white">
              {hasDiaryEntry 
                ? "Want to update your daily tracking?"
                : "You haven't filled out your diary yet! To understand your disease better we need to track your habits!"
              }
            </p>
            <Button 
              className="bg-white hover:bg-white/90 text-[#473F63]"
              onClick={handleDiaryClick}
            >
              {hasDiaryEntry ? "Update Diary" : "Continue"}
            </Button>
          </CardContent>
        </Card>

        

        {/* Study Cards Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Next Study Appointment */}
          <Card className="bg-[#E6E3FD] border-none rounded-2xl p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-[#473F63] text-sm sm:text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                Next Study Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <div className="text-[#473F63] space-y-1">
                <p className="font-medium text-xs sm:text-sm line-clamp-1">
                  Gene Therapy - Ph.2
                </p>
                <p className="text-xs">Jan 15, 10:00 AM</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#473F63] text-white bg-[#473F63] mt-2 text-xs w-full sm:w-auto"
                  onClick={() => {
                    const event = {
                      begin: '2024-01-15T10:00:00',
                      title: 'Gene Therapy Study - Phase 2',
                      description: 'Study appointment for Gene Therapy Phase 2',
                    };
                    
                    const icsContent = [
                      'BEGIN:VCALENDAR',
                      'VERSION:2.0',
                      'BEGIN:VEVENT',
                      `DTSTART:${event.begin.replace(/[-:]/g, '')}`,
                      `SUMMARY:${event.title}`,
                      `DESCRIPTION:${event.description}`,
                      'END:VEVENT',
                      'END:VCALENDAR'
                    ].join('\n');

                    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'appointment.ics';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Add to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Matching Study */}
          <Card className="bg-[#E6E3FD] border-none rounded-2xl p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-[#473F63] text-sm sm:text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                Study Match for you
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <div className="space-y-2">
                <p className="text-[#473F63] text-xs sm:text-sm line-clamp-2">
                  Gene Therapy Trial XYZ-123
                </p>
                <div>
                <Link href="/studies/apply/1">
                  <Button 
                    size="sm"
                    className="bg-[#473F63] text-white w-full sm:w-auto text-xs"
                  >
                    Apply Now
                  </Button>
                </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#DEEAE5] border-none rounded-2xl p-6">
          <CardHeader className="p-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-[#1E4D57] text-lg">Your Activity</CardTitle>
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-auto p-2"
                    onClick={handleHealthSync}
                    disabled={isHealthSynced}
                  >
                    <AppleIcon className="w-5 h-5 text-[#1E4D57]" />
                  </Button>
                  <span className="text-xs text-[#1E4D57]/70">
                    {isHealthSynced ? "Synced" : "Sync"}
                  </span>
                </div>
                <Select value={timeRange} onValueChange={(value: "today" | "week" | "month") => setTimeRange(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData[timeRange]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8F8BAF" />
                <XAxis 
                  dataKey="time" 
                  stroke="#1E4D57"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#1E4D57"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #1E4D57',
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    minWidth: 'auto',
                  }}
                  labelStyle={{
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    fontSize: '12px',
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
                  wrapperStyle={{
                    zIndex: 1000,
                    outline: 'none',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1E4D57" 
                  strokeWidth={2}
                  dot={{ fill: '#1E4D57', strokeWidth: 2, r: 4 }}
                  activeDot={{ 
                    r: 6,
                    stroke: '#1E4D57',
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 text-xs text-[#1E4D57]/70 flex justify-between">
              <span>1: Complete Rest</span>
              <span>---</span>
              <span>5: Intense Exercise</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Mood Overview */}
          <Card className="bg-[#E6E3FD] border-none rounded-2xl p-3 sm:p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-[#473F63] text-xs sm:text-base flex items-center gap-1 sm:gap-2">
                <Smile className="w-3 h-3 sm:w-5 sm:h-5" />
                Mood
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-1 sm:mt-2">
              <div className="flex items-center justify-between">
                <div className="text-[#473F63]">
                  <p className="text-lg sm:text-2xl font-medium">
                    {mood}/3
                  </p>
                  <p className="text-[10px] sm:text-xs">Today</p>
                </div>
                {mood === 3 ? (
                  <Smile className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                ) : mood === 2 ? (
                  <Meh className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                ) : (
                  <Frown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Symptoms Overview */}
          <Card className="bg-[#E6E3FD] border-none rounded-2xl p-3 sm:p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-[#473F63] text-xs sm:text-base flex items-center gap-1 sm:gap-2">
                <Activity className="w-3 h-3 sm:w-5 sm:h-5" />
                Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-1 sm:mt-2">
              <div className="text-[#473F63]">
                <p className="text-lg sm:text-2xl font-medium">
                  {symptoms.filter(s => s.selected).length}
                </p>
                <p className="text-[10px] sm:text-xs">Active</p>
              </div>
              <div className="mt-1 hidden sm:flex flex-wrap gap-1">
                {symptoms.filter(s => s.selected).slice(0, 2).map(symptom => (
                  <Badge key={symptom.label} variant="secondary" className="text-xs">
                    {symptom.label}
                  </Badge>
                ))}
                {symptoms.filter(s => s.selected).length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{symptoms.filter(s => s.selected).length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medications Overview */}
          <Card className="bg-[#E6E3FD] border-none rounded-2xl p-3 sm:p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-[#473F63] text-xs sm:text-base flex items-center gap-1 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-5 sm:h-5" />
                Meds
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-1 sm:mt-2">
              <div className="text-[#473F63]">
                <p className="text-lg sm:text-2xl font-medium">
                  {medications.filter(m => m.taken).length}/{medications.length}
                </p>
                <p className="text-[10px] sm:text-xs">Taken</p>
              </div>
              <div className="mt-1 hidden sm:flex flex-wrap gap-1">
                {medications.slice(0, 2).map(med => (
                  <Badge 
                    key={med.name} 
                    variant={med.taken ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {med.name}
                  </Badge>
                ))}
                {medications.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{medications.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

       

        {/* Forum Section - More compact for mobile */}
        <Card className="bg-[#DEEAE5] border-none rounded-2xl p-4">
          <Link href="/forum/chat/1" className="block">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-[#1E4D57] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex item from overflowing */}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[#1E4D57] font-medium text-sm truncate">
                    New Treatment Breakthrough
                  </h3>
                  <Badge variant="secondary" className="flex-shrink-0 text-xs">
                    Trending
                  </Badge>
                </div>
                <p className="text-xs text-[#1E4D57]/80 line-clamp-2">
                  Join 45 others discussing the latest research on treatment options and clinical trials...
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#1E4D57]/60">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> 23
                  </span>
                  <span>•</span>
                  <span>2h ago</span>
                </div>
              </div>
            </div>
          </Link>
        </Card>

        {/* Community Progress Section */}
        <Card className="bg-[#DEEAE5] border-none rounded-2xl p-4 sm:p-6 mb-20">
          <CardHeader className="p-0">
            <CardTitle className="text-[#1E4D57] text-base sm:text-lg">Our Collective Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-2 sm:mt-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Active Users */}
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-medium text-[#1E4D57]">2,450</div>
                <div className="text-xs sm:text-sm text-[#1E4D57]">Active Users</div>
              </div>

              {/* Therapies */}
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-medium text-[#1E4D57]">156</div>
                <div className="text-xs sm:text-sm text-[#1E4D57]">Therapies</div>
              </div>

              {/* Journal Entries */}
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-medium text-[#1E4D57]">8.2k</div>
                <div className="text-xs sm:text-sm text-[#1E4D57]">Journal Entries</div>
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

      <Dialog open={showDiaryModal} onOpenChange={(open) => {
        setShowDiaryModal(open);
        if (!open) setCurrentStep(1); // Reset to first step when closing
      }}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{getStepTitle(currentStep)}</DialogTitle>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {/* Step 1: Mood */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <div 
                    className={`flex flex-col items-center gap-2 cursor-pointer transition-all transform ${
                      mood === 1 ? 'scale-110' : 'opacity-50 hover:opacity-75'
                    }`}
                    onClick={() => setMood(1)}
                  >
                    <Frown className={`w-16 h-16 ${mood === 1 ? 'text-red-500' : 'text-gray-300'}`} />
                    <span className="text-sm font-medium">Not Good</span>
                  </div>
                  <div 
                    className={`flex flex-col items-center gap-2 cursor-pointer transition-all transform ${
                      mood === 2 ? 'scale-110' : 'opacity-50 hover:opacity-75'
                    }`}
                    onClick={() => setMood(2)}
                  >
                    <Meh className={`w-16 h-16 ${mood === 2 ? 'text-yellow-500' : 'text-gray-300'}`} />
                    <span className="text-sm font-medium">Okay</span>
                  </div>
                  <div 
                    className={`flex flex-col items-center gap-2 cursor-pointer transition-all transform ${
                      mood === 3 ? 'scale-110' : 'opacity-50 hover:opacity-75'
                    }`}
                    onClick={() => setMood(3)}
                  >
                    <Smile className={`w-16 h-16 ${mood === 3 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm font-medium">Good</span>
                  </div>
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
                      className={`relative rounded-xl p-4 cursor-pointer transition-all ${
                        selectedActivity === activity.value
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-gray-50 border-2 border-transparent hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedActivity(activity.value)}
                    >
                      {selectedActivity === activity.value && (
                        <div className="absolute top-2 right-2">
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-3">
                        {activity.icon}
                        <span className="text-sm font-medium text-center">{activity.label}</span>
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
                      className={`relative rounded-xl p-4 cursor-pointer transition-all ${
                        symptom.selected
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-gray-50 border-2 border-transparent hover:border-primary/30'
                      }`}
                      onClick={() => {
                        const newSymptoms = [...symptoms];
                        newSymptoms[index].selected = !newSymptoms[index].selected;
                        setSymptoms(newSymptoms);
                      }}
                    >
                      {symptom.selected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <span className="text-sm font-medium">{symptom.label}</span>
                    </div>
                  ))}
                </div>
                
                {showSymptomInput ? (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      placeholder="Enter symptom name"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                        className="flex-1"
                      >
                        Add Symptom
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewSymptom("");
                          setShowSymptomInput(false);
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

          {/* Fixed footer */}
          <div className="flex-shrink-0 pt-6 border-t mt-6">
            {/* Progress Steps */}
            <div className="flex justify-between items-center px-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      step === currentStep
                        ? 'bg-primary scale-125'
                        : step < currentStep
                        ? 'bg-primary/50'
                        : 'bg-gray-200'
                    }`}
                  />
                  <span className={`text-xs ${
                    step === currentStep ? 'text-primary font-medium' : 'text-gray-400'
                  }`}>
                    Step {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1"
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
                className="flex-1"
              >
                {currentStep < 4 ? 'Continue' : 'Complete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}


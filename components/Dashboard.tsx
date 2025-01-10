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
import { Calendar, MessageCircle, Activity, Clock, AppleIcon } from 'lucide-react';
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
  const [mood, setMood] = useState<number>(3);
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { label: "Muscle Weakness", selected: false },
    { label: "Fatigue", selected: false },
    { label: "Joint Pain", selected: false },
    { label: "Difficulty Swallowing", selected: false },
    { label: "Custom Symptom", selected: false },
  ]);
  const [medications, setMedications] = useState<Medication[]>([
    { name: "Prednisone", taken: false, prescribed: true },
    { name: "Methotrexate", taken: false, prescribed: true },
    { name: "Rituximab", taken: false, prescribed: true },
  ]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [newSymptom, setNewSymptom] = useState<string>("");
  const [showSymptomInput, setShowSymptomInput] = useState(false);
  const [newMedication, setNewMedication] = useState<string>("");
  const [showMedicationInput, setShowMedicationInput] = useState(false);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");
  const [activityData, setActivityData] = useState({
    today: [
      { time: '9AM', value: 2, activity: 'Light Activity' },
      { time: '11AM', value: 3, activity: 'Walking' },
      { time: '1PM', value: 1, activity: 'Resting' },
      { time: '3PM', value: 4, activity: 'Strength Training' },
      { time: '5PM', value: 2, activity: 'Light Activity' },
      { time: '7PM', value: 3, activity: 'Walking' },
      { time: '9PM', value: 1, activity: 'Resting' },
    ],
    week: [
      { time: 'Mon', value: 2, activity: 'Light Activity' },
      { time: 'Tue', value: 3, activity: 'Walking' },
      { time: 'Wed', value: 4, activity: 'Strength Training' },
      { time: 'Thu', value: 2, activity: 'Light Activity' },
      { time: 'Fri', value: 3, activity: 'Walking' },
      { time: 'Sat', value: 1, activity: 'Resting' },
      { time: 'Sun', value: 2, activity: 'Light Activity' },
    ],
    month: [
      { time: 'Week 1', value: 2, activity: 'Light Activity' },
      { time: 'Week 2', value: 3, activity: 'Walking' },
      { time: 'Week 3', value: 4, activity: 'Strength Training' },
      { time: 'Week 4', value: 2, activity: 'Light Activity' },
    ],
  });

  const activities: Activity[] = [
    { icon: <Bed size={24} />, label: "Mostly Resting", value: "resting" },
    { icon: <Coffee size={24} />, label: "Light Activity", value: "light" },
    { icon: <Footprints size={24} />, label: "Walking", value: "walking" },
    { icon: <Dumbbell size={24} />, label: "Strength Training", value: "strength" },
    { icon: <Bike size={24} />, label: "Cycling", value: "cycling" },
  ];

  useEffect(() => {
    const diaryEntryStatus = sessionStorage.getItem("hasDiaryEntry");
    if (diaryEntryStatus === "true") {
      setHasDiaryEntry(true);
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
      { time: '9AM', value: 3, activity: 'Walking' },
      { time: '11AM', value: 4, activity: 'Strength Training' },
      { time: '1PM', value: 2, activity: 'Light Activity' },
      { time: '3PM', value: 5, activity: 'Cycling' },
      { time: '5PM', value: 3, activity: 'Walking' },
      { time: '7PM', value: 2, activity: 'Light Activity' },
      { time: '9PM', value: 1, activity: 'Resting' },
    ],
    week: [
      { time: 'Mon', value: 3, activity: 'Walking' },
      { time: 'Tue', value: 4, activity: 'Strength Training' },
      { time: 'Wed', value: 5, activity: 'Cycling' },
      { time: 'Thu', value: 3, activity: 'Walking' },
      { time: 'Fri', value: 4, activity: 'Strength Training' },
      { time: 'Sat', value: 2, activity: 'Light Activity' },
      { time: 'Sun', value: 3, activity: 'Walking' },
    ],
    month: [
      { time: 'Week 1', value: 3, activity: 'Walking' },
      { time: 'Week 2', value: 4, activity: 'Strength Training' },
      { time: 'Week 3', value: 5, activity: 'Cycling' },
      { time: 'Week 4', value: 3, activity: 'Walking' },
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
    <div className="space-y-4">
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
            Welcome to rarely Fe!
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
                />
                <YAxis 
                  stroke="#1E4D57"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #1E4D57' 
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${props.payload.activity} (Level ${value})`,
                    'Activity'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1E4D57" 
                  strokeWidth={2}
                  dot={{ fill: '#1E4D57', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 text-sm text-[#1E4D57]/70">
          {/*     Activity Level:  */}
              1 = Resting
{/*               , 2 = Light Activity, 3 = Walking, 4 = Strength Training, 
 */}              ---
              5 = Intense Exercise
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
                    {mood}/5
                  </p>
                  <p className="text-[10px] sm:text-xs">Today</p>
                </div>
                {mood >= 4 ? (
                  <Smile className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                ) : mood === 3 ? (
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
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>{getStepTitle(currentStep)}</DialogTitle>
          </DialogHeader>
          
          {/* Step 1: Mood */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4">
                <Frown className={`w-12 h-12 ${mood <= 2 ? 'text-red-500' : 'text-gray-300'} cursor-pointer transition-colors`} 
                  onClick={() => setMood(2)} />
                <Meh className={`w-12 h-12 ${mood === 3 ? 'text-yellow-500' : 'text-gray-300'} cursor-pointer transition-colors`}
                  onClick={() => setMood(3)} />
                <Smile className={`w-12 h-12 ${mood >= 4 ? 'text-green-500' : 'text-gray-300'} cursor-pointer transition-colors`}
                  onClick={() => setMood(4)} />
              </div>
              <Slider
                value={[mood]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setMood(value[0])}
                className="w-full"
              />
            </div>
          )}

          {/* Step 2: Activity */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {activities.map((activity) => (
                  <Button
                    key={activity.value}
                    variant={selectedActivity.includes(activity.value) ? "default" : "outline"}
                    className="flex flex-col gap-2 h-auto py-4"
                    onClick={() => setSelectedActivity(prev => 
                      prev.includes(activity.value) 
                        ? prev.filter(a => a !== activity.value)
                        : [...prev, activity.value]
                    )}
                  >
                    {activity.icon}
                    <span className="text-sm">{activity.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Symptoms */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {symptoms.map((symptom, index) => (
                  <Badge
                    key={symptom.label}
                    variant={symptom.selected ? "default" : "outline"}
                    className="cursor-pointer p-3 flex justify-center items-center text-center"
                    onClick={() => {
                      const newSymptoms = [...symptoms];
                      newSymptoms[index].selected = !newSymptoms[index].selected;
                      setSymptoms(newSymptoms);
                    }}
                  >
                    {symptom.label}
                  </Badge>
                ))}
              </div>
              
              {showSymptomInput ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      placeholder="Enter symptom name"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button
                      onClick={() => {
                        if (newSymptom.trim()) {
                          setSymptoms([...symptoms, { label: newSymptom.trim(), selected: true }]);
                          setNewSymptom("");
                          setShowSymptomInput(false);
                        }
                      }}
                      size="sm"
                    >
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
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
                  size="sm" 
                  className="w-full gap-1"
                  onClick={() => setShowSymptomInput(true)}
                >
                  <Plus size={16} /> Add Custom Symptom
                </Button>
              )}
            </div>
          )}

          {/* Step 4: Medications */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={med.name} className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="font-medium">{med.name}</span>
                  <Button
                    variant={med.taken ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newMeds = [...medications];
                      newMeds[index].taken = !newMeds[index].taken;
                      setMedications(newMeds);
                    }}
                  >
                    {med.taken ? "Taken" : "Not Taken"}
                  </Button>
                </div>
              ))}
              
              {showMedicationInput ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Enter medication name"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button
                      onClick={() => {
                        if (newMedication.trim()) {
                          setMedications([
                            ...medications,
                            { name: newMedication.trim(), taken: true, prescribed: false }
                          ]);
                          setNewMedication("");
                          setShowMedicationInput(false);
                        }
                      }}
                      size="sm"
                    >
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
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
                  size="sm" 
                  className="w-full gap-1"
                  onClick={() => setShowMedicationInput(true)}
                >
                  <Plus size={16} /> Add Medication
                </Button>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2 mt-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={submitDiary}
                className="flex-1"
              >
                Save Entry
              </Button>
            )}
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full ${
                  step === currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


"use client"

import React, { useState, useEffect, cloneElement } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";
import { Calendar, MessageCircle, Activity, Check, Heart, Grid, Pill, Smile, Download, Info } from 'lucide-react';

// Replace the import line with these icons that are definitely available
import {Trash2} from 'lucide-react';

import { 
  FaLeaf,
  FaHome,
  FaBiking,
  FaWalking,
  FaRunning,
  FaSwimmer,
  FaPrayingHands
} from 'react-icons/fa';


import {DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


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
  severity: number;
}

interface Medication {
  name: string;
  taken: boolean;
  prescribed: boolean;
  category: string;
  dosage: {
    value: number;
    unit: string;
  };
}



// ... rest of existing code ...
export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [hasDiaryEntry, setHasDiaryEntry] = useState<boolean>(false);
  const [isHealthSynced, setIsHealthSynced] = useState<boolean>(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [mood, setMood] = useState<number>(2);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { label: "Palpitations", selected: false, severity: 0 },
    { label: "Extra Heartbeats", selected: false, severity: 0 },
    { label: "Rapid Heartbeat", selected: false, severity: 0 },
    { label: "Shortness of Breath", selected: false, severity: 0 },
    { label: "Chest Pain/Discomfort", selected: false, severity: 0 },
    { label: "Dizziness", selected: false, severity: 0 },
    { label: "Loss of Consciousness", selected: false, severity: 0 },
    { label: "Fatigue", selected: false, severity: 0 },
  ]);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  
  // Helper function to get current time in HH:mm format
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [medications, setMedications] = useState<Medication[]>([
    // Antiarrhythmic drugs
    { name: "Sotalol", taken: false, prescribed: true, category: "Antiarrhythmic", dosage: { value: 80, unit: "mg" } },
    { name: "Amiodarone", taken: false, prescribed: false, category: "Antiarrhythmic", dosage: { value: 200, unit: "mg" } },
    { name: "Flecainide", taken: false, prescribed: false, category: "Antiarrhythmic", dosage: { value: 100, unit: "mg" } },
    
    // Beta blockers
    { name: "Bisoprolol", taken: false, prescribed: true, category: "Beta Blocker", dosage: { value: 20, unit: "mg" } },
    { name: "Metoprolol", taken: false, prescribed: false, category: "Beta Blocker", dosage: { value: 50, unit: "mg" } },
    
    // Heart failure drugs
    { name: "ACE Inhibitor", taken: false, prescribed: true, category: "Heart Failure", dosage: { value: 10, unit: "mg" } },
    { name: "Entresto (Sacubitril/Valsartan)", taken: false, prescribed: true, category: "Heart Failure", dosage: { value: 20, unit: "mg" } },
    { name: "Eplerenon", taken: false, prescribed: false, category: "Heart Failure", dosage: { value: 10, unit: "mg" } },
    { name: "Finerenon", taken: false, prescribed: false, category: "Heart Failure", dosage: { value: 10, unit: "mg" } },
    
    // Diuretics
    { name: "Furosemide", taken: false, prescribed: false, category: "Diuretic", dosage: { value: 20, unit: "mg" } },
    { name: "Torasemide", taken: false, prescribed: false, category: "Diuretic", dosage: { value: 20, unit: "mg" } },
    
    // SGLT2 Inhibitors
    { name: "SGLT2 Inhibitor", taken: false, prescribed: false, category: "SGLT2", dosage: { value: 10, unit: "mg" } },
  ]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [newSymptom, setNewSymptom] = useState<string>("");
  const [showSymptomInput, setShowSymptomInput] = useState(false);
  const [newMedication, setNewMedication] = useState<string>("");
  const [showMedicationInput, setShowMedicationInput] = useState(false);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");

  // Add this state to track if we're showing the summary
  const [showActivitySummary, setShowActivitySummary] = useState(false);

  // Add this state for saved activities
  const [savedActivities, setSavedActivities] = useState<SavedActivity[]>([]);

  // Add the useEffect here, after states, before return
  useEffect(() => {
    if (currentStep === 2) {
      setSelectedActivity("");
      setShowActivitySummary(false);
      setShowExerciseDetails(false);
    }
  }, [currentStep]);



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

  // Add these state variables at the beginning of your Dashboard component
  const [showExerciseDetails, setShowExerciseDetails] = useState(false);
  const [exerciseData, setExerciseData] = useState({
    description: "",
    date: getCurrentDate(),  // Set current date as default
    time: getCurrentTime(),  // Set current time as default
    duration: {
      hours: 0,
      minutes: 0
    },
    distance: 0,
    steps: 0,
    intensity: 50,
  });





  const [streakCount, setStreakCount] = useState<number>(7);
  const [syncedProviders, setSyncedProviders] = useState<HealthProvider[]>([]);

  const { userData, setUserData } = useUser();

  const activities: Activity[] = [
    { icon: <Bed size={24} />, label: "Complete Rest", value: "rest" },
    { icon: <Coffee size={24} />, label: "Daily Activities", value: "daily" },
    { icon: <Footprints size={24} />, label: "Light Exercise", value: "light" },
    { icon: <Dumbbell size={24} />, label: "Moderate Exercise", value: "moderate" },
    { icon: <Bike size={24} />, label: "Intense Exercise", value: "intense" },
  ];

  useEffect(() => {
    // Load diary entry status
    const diaryEntryStatus = sessionStorage.getItem("hasDiaryEntry");
    if (diaryEntryStatus === "true") {
      setHasDiaryEntry(true);
    }

    // Load synced providers
    const savedSyncedProviders = localStorage.getItem("syncedProviders");
    if (savedSyncedProviders) {
      setSyncedProviders(JSON.parse(savedSyncedProviders));
      setIsHealthSynced(true);
    }

    // Load activity data
    const savedActivityData = localStorage.getItem("activityData");
    if (savedActivityData) {
      setActivityData(JSON.parse(savedActivityData));
    }
  }, []);

  // In your useEffect, update the condition to show the summary view when entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      setSelectedActivity("");
      // Show the summary view instead of hiding it
      setShowActivitySummary(true);
      setShowExerciseDetails(false);
    }
  }, [currentStep]);

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

  // Add these mock data sets
  const mockHealthData = {
    apple: {
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
    },
    whoop: {
      today: [
        { time: '9AM', value: 3, activity: 'Light Exercise' },
        { time: '11AM', value: 4, activity: 'Moderate Exercise' },
        { time: '1PM', value: 3, activity: 'Light Exercise' },
        { time: '3PM', value: 5, activity: 'Intense Exercise' },
        { time: '5PM', value: 4, activity: 'Moderate Exercise' },
        { time: '7PM', value: 3, activity: 'Light Exercise' },
        { time: '9PM', value: 1, activity: 'Complete Rest' },
      ],
      week: [
        { time: 'Mon', value: 4, activity: 'Moderate Exercise' },
        { time: 'Tue', value: 5, activity: 'Intense Exercise' },
        { time: 'Wed', value: 4, activity: 'Moderate Exercise' },
        { time: 'Thu', value: 3, activity: 'Light Exercise' },
        { time: 'Fri', value: 5, activity: 'Intense Exercise' },
        { time: 'Sat', value: 3, activity: 'Light Exercise' },
        { time: 'Sun', value: 2, activity: 'Daily Activities' },
      ],
      month: [
        { time: 'Week 1', value: 4, activity: 'Moderate Exercise' },
        { time: 'Week 2', value: 5, activity: 'Intense Exercise' },
        { time: 'Week 3', value: 4, activity: 'Moderate Exercise' },
        { time: 'Week 4', value: 3, activity: 'Light Exercise' },
      ],
    },
    oura: {
      today: [
        { time: '9AM', value: 1, activity: 'Complete Rest' },
        { time: '11AM', value: 2, activity: 'Daily Activities' },
        { time: '1PM', value: 4, activity: 'Moderate Exercise' },
        { time: '3PM', value: 3, activity: 'Light Exercise' },
        { time: '5PM', value: 2, activity: 'Daily Activities' },
        { time: '7PM', value: 3, activity: 'Light Exercise' },
        { time: '9PM', value: 1, activity: 'Complete Rest' },
      ],
      week: [
        { time: 'Mon', value: 2, activity: 'Daily Activities' },
        { time: 'Tue', value: 3, activity: 'Light Exercise' },
        { time: 'Wed', value: 4, activity: 'Moderate Exercise' },
        { time: 'Thu', value: 5, activity: 'Intense Exercise' },
        { time: 'Fri', value: 3, activity: 'Light Exercise' },
        { time: 'Sat', value: 2, activity: 'Daily Activities' },
        { time: 'Sun', value: 4, activity: 'Moderate Exercise' },
      ],
      month: [
        { time: 'Week 1', value: 2, activity: 'Daily Activities' },
        { time: 'Week 2', value: 3, activity: 'Light Exercise' },
        { time: 'Week 3', value: 4, activity: 'Moderate Exercise' },
        { time: 'Week 4', value: 5, activity: 'Intense Exercise' },
      ],
    },
    fitbit: {
      today: [
        { time: '9AM', value: 2, activity: 'Daily Activities' },
        { time: '11AM', value: 3, activity: 'Light Exercise' },
        { time: '1PM', value: 5, activity: 'Intense Exercise' },
        { time: '3PM', value: 4, activity: 'Moderate Exercise' },
        { time: '5PM', value: 3, activity: 'Light Exercise' },
        { time: '7PM', value: 2, activity: 'Daily Activities' },
        { time: '9PM', value: 1, activity: 'Complete Rest' },
      ],
      week: [
        { time: 'Mon', value: 3, activity: 'Light Exercise' },
        { time: 'Tue', value: 4, activity: 'Moderate Exercise' },
        { time: 'Wed', value: 5, activity: 'Intense Exercise' },
        { time: 'Thu', value: 4, activity: 'Moderate Exercise' },
        { time: 'Fri', value: 3, activity: 'Light Exercise' },
        { time: 'Sat', value: 4, activity: 'Moderate Exercise' },
        { time: 'Sun', value: 3, activity: 'Light Exercise' },
      ],
      month: [
        { time: 'Week 1', value: 3, activity: 'Light Exercise' },
        { time: 'Week 2', value: 4, activity: 'Moderate Exercise' },
        { time: 'Week 3', value: 5, activity: 'Intense Exercise' },
        { time: 'Week 4', value: 4, activity: 'Moderate Exercise' },
      ],
    },
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      garden: <FaLeaf className="w-5 h-5" />,
      home: <FaHome className="w-5 h-5" />,
      cycling: <FaBiking className="w-5 h-5" />,
      walking: <FaWalking className="w-5 h-5" />,
      running: <FaRunning className="w-5 h-5" />,
      swimming: <FaSwimmer className="w-5 h-5" />,
      yoga: <FaPrayingHands className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons];
  };
  
  const getActivityLabel = (type: string) => {
    const labels = {
      garden: "Lawn & Garden",
      home: "Home Activities",
      cycling: "Cycling",
      walking: "Walking",
      running: "Running",
      swimming: "Swimming",
      yoga: "Yoga"
    };
    return labels[type as keyof typeof labels];
  };



  const submitDiary = () => {
    if (!hasDiaryEntry) {
      setStreakCount(prev => prev + 1);
    }
    
    setHasDiaryEntry(true);
    sessionStorage.setItem("hasDiaryEntry", "true");
    localStorage.setItem("streakCount", String(streakCount + 1));
    setShowDiaryModal(false);
    // Save diary data
    const diaryData = {
      mood,
      selectedActivity,
      symptoms,
      medications,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("lastDiaryEntry", JSON.stringify(diaryData));
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "How are you feeling today?";
      case 2: return "What activities did you do today?";
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

  // Update the type (should be near the top with other interfaces)
  type HealthProvider = 'apple' | 'whoop' | 'oura' | 'fitbit';

  // Add this type for saved activities
  type SavedActivity = {
    type: string;
    description: string;
    datetime: string;
    intensity: number;
    duration?: {
      hours: number;
      minutes: number;
    };
    distance?: number;
    steps?: number;
  };


  // Update handleHealthSync function
  const handleHealthSync = (provider: HealthProvider) => {
    const newSyncedProviders = [...syncedProviders, provider];
    setIsHealthSynced(true);
    setSyncedProviders(newSyncedProviders);
    setActivityData(mockHealthData[provider]);

    // Save to localStorage
    localStorage.setItem("syncedProviders", JSON.stringify(newSyncedProviders));
    localStorage.setItem("activityData", JSON.stringify(mockHealthData[provider]));
    localStorage.setItem("isHealthSynced", "true");
  };

  const matchingStudy = studies.find(study => study.id === "NCT00083395");

  // Add useEffect to load streak count
  useEffect(() => {
    const savedStreakCount = localStorage.getItem("streakCount");
    if (savedStreakCount) {
      setStreakCount(parseInt(savedStreakCount));
    }
  }, []);

  // Add useEffect to handle diary reset at midnight
  useEffect(() => {
    const checkNewDay = () => {
      const lastEntry = localStorage.getItem("lastDiaryEntry");
      if (lastEntry) {
        const lastEntryDate = new Date(JSON.parse(lastEntry).timestamp);
        const today = new Date();
        if (lastEntryDate.getDate() !== today.getDate()) {
          setHasDiaryEntry(false);
          sessionStorage.removeItem("hasDiaryEntry");
        }
      }
    };

    checkNewDay();
    const interval = setInterval(checkNewDay, 1000 * 60); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E3D7F4] via-[#f0e9fa] to-[#f8f8fa]">
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
          {/* Updated streak counter */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">{streakCount}</span>
              <span className="text-orange-500">🔥</span>
            </div>
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
                  <Heart className="w-5 h-5 text-[#3a2a76]" />
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
                  <Pill className="w-5 h-5 text-[#3a2a76]" />
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
                  <Activity className="w-5 h-5 text-[#3a2a76]" />
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
              
              {/* Health Tracking Integration */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-gray-500">Sync with:</span>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <Button 
                      size="sm"
                      variant="ghost" 
                      className={`px-2 py-1 ${syncedProviders.includes('apple') ? 'bg-gray-100' : 'bg-gray-50'}`}
                      onClick={() => !syncedProviders.includes('apple') && handleHealthSync('apple')}
                    >
                      <Image src="/health.webp" alt="Apple" width={14} height={14} />
                    </Button>
                    {syncedProviders.includes('apple') && (
                      <span className="text-[10px] text-gray-600 mt-1">Synced</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <Button 
                      size="sm"
                      variant="ghost" 
                      className={`px-2 py-1 ${syncedProviders.includes('whoop') ? 'bg-gray-100' : 'bg-gray-50'}`}
                      onClick={() => !syncedProviders.includes('whoop') && handleHealthSync('whoop')}
                    >
                      <Image src="/whoop.png" alt="Whoop" width={14} height={14} />
                    </Button>
                    {syncedProviders.includes('whoop') && (
                      <span className="text-[10px] text-gray-600 mt-1">Synced</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <Button 
                      size="sm"
                      variant="ghost" 
                      className={`px-2 py-1 ${syncedProviders.includes('oura') ? 'bg-gray-100' : 'bg-gray-50'}`}
                      onClick={() => !syncedProviders.includes('oura') && handleHealthSync('oura')}
                    >
                      <Image src="/oura.png" alt="Oura" width={14} height={14} />
                    </Button>
                    {syncedProviders.includes('oura') && (
                      <span className="text-[10px] text-gray-600 mt-1">Synced</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <Button 
                      size="sm"
                      variant="ghost" 
                      className={`px-2 py-1 ${syncedProviders.includes('fitbit') ? 'bg-gray-100' : 'bg-gray-50'}`}
                      onClick={() => !syncedProviders.includes('fitbit') && handleHealthSync('fitbit')}
                    >
                      <Image src="/fitbit.png" alt="Fitbit" width={14} height={14} />
                    </Button>
                    {syncedProviders.includes('fitbit') && (
                      <span className="text-[10px] text-gray-600 mt-1">Synced</span>
                    )}
                  </div>
                </div>
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
              <div className="text-sm font-medium text-gray-500 mb-3">Upcoming Appointment</div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#3a2a76]" />
                  <div>
                    <p className="font-medium">Isoproterenol Challenge - ARVC Detection</p>
                    <p className="text-sm text-gray-500">Jan 15, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-[#007AFF] border-[#007AFF] hover:bg-[#007AFF]/10"
                    onClick={() => generateICalEvent({
                      title: "Isoproterenol Challenge - ARVC Detection",
                      studyId: "NCT00083395",
                      location: "Bethesda, Maryland, United States"
                    })}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Match */}
          {matchingStudy && (
            <Card className="bg-white/95 shadow-sm backdrop-blur-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-[#3a2a76]" />
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
                            <DialogTitle>{matchingStudy.title}</DialogTitle>
                            <DialogDescription>
                              <div className="space-y-4">
                                <p>{matchingStudy.explanation}</p>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {matchingStudy.title}
                    </p>
                  </div>
                </div>
                <Link href={`/studies/apply/${matchingStudy.id}`}>
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
                <MessageCircle className="w-5 h-5 text-[#3a2a76] mt-0.5" />
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
        <DialogContent className="max-w-md mx-auto max-h-[90vh] flex flex-col bg-white/95 backdrop-blur-sm rounded-3xl border-0">
          <DialogHeader className="flex-shrink-0 space-y-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#3a2a76]" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {getStepTitle(currentStep)}
              </DialogTitle>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#3a2a76] transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {/* Step 1: Mood */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <Frown />, value: 1, label: "Not Good", color: "bg-red-100", textColor: "text-red-500" },
                    { icon: <Meh />, value: 2, label: "Okay", color: "bg-yellow-100", textColor: "text-yellow-500" },
                    { icon: <Smile />, value: 3, label: "Good", color: "bg-green-100", textColor: "text-green-500" }
                  ].map((item) => (
                    <div 
                      key={item.value}
                      className={`flex flex-col items-center gap-3 cursor-pointer transition-all ${
                        mood === item.value ? 'scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setMood(item.value)}
                    >
                      <div className={`w-full aspect-square rounded-2xl flex items-center justify-center ${
                        mood === item.value 
                          ? `${item.color}` 
                          : 'bg-white/95 border border-gray-100'
                      }`}>
                        {cloneElement(item.icon, { 
                          className: `w-8 h-8 ${mood === item.value ? item.textColor : 'text-gray-400'}`
                        })}
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
              <div className="space-y-6">
                {!showActivitySummary ? (
                  // Activity Selection View
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center mb-8">What activities did you do?</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: getActivityIcon("garden"), label: "Lawn & Garden", value: "garden" },
                        { icon: getActivityIcon("home"), label: "Home Activities", value: "home" },
                        { icon: getActivityIcon("cycling"), label: "Cycling", value: "cycling" },
                        { icon: getActivityIcon("walking"), label: "Walking", value: "walking" },
                        { icon: getActivityIcon("running"), label: "Running", value: "running" },
                        { icon: getActivityIcon("swimming"), label: "Swimming", value: "swimming" },
                        { icon: getActivityIcon("yoga"), label: "Yoga", value: "yoga" }
                      ].map((activity) => (
                        <div
                          key={activity.value}
                          onClick={() => {
                            setSelectedActivity(activity.value);
                            // Reset exercise data when opening new entry
                            setExerciseData({
                              description: "",
                              date: getCurrentDate(),
                              time: getCurrentTime(),
                              duration: {
                                hours: 0,
                                minutes: 0
                              },
                              distance: 0,
                              steps: 0,
                              intensity: 50
                            });
                            setShowExerciseDetails(true);
                          }}
                          className={`relative p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center gap-4 ${
                            selectedActivity === activity.value
                              ? 'border-[#3a2a76] bg-white'
                              : 'border-gray-100 bg-white hover:border-[#3a2a76]/30'
                          }`}
                        >
                          <div className={`w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center ${
                            selectedActivity === activity.value ? 'bg-[#3a2a76]/10' : ''
                          }`}>
                            {activity.icon}
                          </div>
                          <span className={`text-lg font-medium text-center ${
                            selectedActivity === activity.value 
                              ? 'text-[#3a2a76]' 
                              : 'text-gray-600'
                          }`}>
                            {activity.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Activity Summary View
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Today's Activities</h2>
                      <Button
                        onClick={() => {
                          setShowActivitySummary(false);
                          setSelectedActivity("");
                        }}
                        className="bg-black hover:bg-gray-800 text-white rounded-xl px-4 py-2 flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" /> Add Activity
                      </Button>
                    </div>

                    <div className="space-y-4">
                    {savedActivities
                      .sort((a, b) => {
                        const timeA = a.datetime.split(' at ')[1];
                        const timeB = b.datetime.split(' at ')[1];
                        return timeA.localeCompare(timeB);
                      })
                      .map((activity, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 relative">
                          <button
                            onClick={() => {
                              const newActivities = savedActivities.filter((_, i) => i !== index);
                              setSavedActivities(newActivities);
                            }}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>
                      
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold">{activity.description}</h3>
                              <div className="text-gray-600">
                                {getActivityLabel(activity.type)} • {activity.datetime.split(' at ')[1]}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div>
                              <span className="font-medium">Intensity: </span>
                              <span>{activity.intensity}%</span>
                            </div>
                      
                            {/* Show duration if either hours or minutes exist */}
                            {activity.duration &&   (activity.duration.hours > 0 || activity.duration.minutes > 0) && (
                              <div>
                                <span className="font-medium">Duration: </span>
                                <span>
                                  { activity.duration && activity.duration.hours > 0 && `${activity.duration.hours}h `}
                                  { activity.duration && activity.duration.minutes > 0 && `${activity.duration.minutes}m`}
                                </span>
                              </div>
                            )}
                      
                            {/* Show steps if they exist */}
                            {activity.steps && activity.steps > 0 && (
                              <div>
                                <span className="font-medium">Distance: </span>
                                <span>{activity.steps} meters</span>
                              </div>
                            )}
                      
                            {/* Show distance if it exists */}
                            {activity.distance && activity.distance > 0 && (
                              <div>
                                <span className="font-medium">Distance: </span>
                                <span>{activity.distance} km</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercise Details Dialog */}
                <Dialog open={showExerciseDetails} onOpenChange={setShowExerciseDetails}>
                  <DialogContent className="sm:max-w-[600px] p-6">
                    <DialogHeader className="mb-4">
                      <DialogTitle className="text-2xl font-bold">Describe your exercise</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Description */}
                      <div className="space-y-4">
                        {selectedActivity && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                              {getActivityIcon(selectedActivity)}
                            </div>
                            <Label className="text-lg">
                              Category: {getActivityLabel(selectedActivity)}
                            </Label>
                          </div>
                        )}
                        <Input
                          placeholder={selectedActivity 
                            ? `Describe your ${getActivityLabel(selectedActivity).toLowerCase()}`
                            : 'Describe your activity'
                          }
                          value={exerciseData.description}
                          onChange={(e) => setExerciseData(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                          className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                        />
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>When did you exercise</Label>
                          <Input
                            type="date"
                            value={exerciseData.date}
                            onChange={(e) => setExerciseData(prev => ({
                              ...prev,
                              date: e.target.value
                            }))}
                            className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={exerciseData.time}
                            onChange={(e) => setExerciseData(prev => ({
                              ...prev,
                              time: e.target.value
                            }))}
                            className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                          />
                        </div>
                      </div>

                      {/* Time spent (optional) */}
                      <div className="space-y-2">
                        <Label>Time spent (optional)</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Input
                              type="number"
                              placeholder="Hours"
                              value={exerciseData.duration.hours}
                              onChange={(e) => setExerciseData(prev => ({
                                ...prev,
                                duration: {
                                  ...prev.duration,
                                  hours: Number(e.target.value)
                                }
                              }))}
                              className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                            />
                            <span className="text-sm text-gray-500">hours</span>
                          </div>
                          <div className="space-y-1">
                            <Input
                              type="number"
                              placeholder="Minutes"
                              value={exerciseData.duration.minutes}
                              onChange={(e) => setExerciseData(prev => ({
                                ...prev,
                                duration: {
                                  ...prev.duration,
                                  minutes: Number(e.target.value)
                                }
                              }))}
                              className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                            />
                            <span className="text-sm text-gray-500">minutes</span>
                          </div>
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="space-y-2">
                        <Label>Distance (optional)</Label>
                        <div className="space-y-1">
                          <Input
                            type="number"
                            value={exerciseData.steps}
                            onChange={(e) => setExerciseData(prev => ({
                              ...prev,
                              steps: Number(e.target.value)
                            }))}
                            className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                          />
                          <span className="text-sm text-gray-500">meters</span>
                        </div>
                      </div>

                      {/* Intensity */}
                      <div className="space-y-2">
                        <Label>Intensity Level</Label>
                        <div className="space-y-1">
                          <Slider
                            value={[exerciseData.intensity]}
                            onValueChange={(value) => setExerciseData(prev => ({
                              ...prev,
                              intensity: value[0]
                            }))}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Low</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowExerciseDetails(false);
                          setSelectedActivity("");
                        }}
                        className="border-[#3a2a76]/20 hover:bg-[#3a2a76]/10 text-[#3a2a76]"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => {
                          const newActivity = {
                            type: selectedActivity,
                            description: exerciseData.description,
                            datetime: `${exerciseData.date} at ${exerciseData.time}`,
                            intensity: exerciseData.intensity,
                            duration: exerciseData.duration,
                            distance: exerciseData.distance,
                            steps: exerciseData.steps
                          };
                          setSavedActivities([...savedActivities, newActivity]);
                          setShowExerciseDetails(false);
                          setShowActivitySummary(true);
                        }}
                        className="bg-[#3a2a76] hover:bg-[#a680db] text-white"
                      >
                        Add Entry
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>                
              </div>
            )}

            {/* Step 3: Symptoms */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {symptoms.map((symptom, index) => (
                    <div
                      key={symptom.label}
                      className={`relative rounded-xl p-4 transition-all ${
                        symptom.selected
                          ? 'bg-[#3a2a76]/10 border border-[#3a2a76]'
                          : 'bg-white/95 border border-gray-100 hover:border-[#3a2a76]/30'
                      }`}
                    >
                      <div 
                        className="flex items-start justify-between mb-2 cursor-pointer"
                        onClick={() => {
                          const newSymptoms = [...symptoms];
                          newSymptoms[index].selected = !newSymptoms[index].selected;
                          if (!newSymptoms[index].selected) {
                            newSymptoms[index].severity = 0;
                          }
                          setSymptoms(newSymptoms);
                        }}
                      >
                        <span className={`text-sm font-medium ${
                          symptom.selected ? 'text-[#3a2a76]' : 'text-gray-600'
                        }`}>
                          {symptom.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          symptom.selected 
                            ? 'bg-[#3a2a76] border-[#3a2a76]' 
                            : 'border-gray-300'
                        }`}>
                          {symptom.selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>

                      {symptom.selected && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Mild</span>
                            <span>Severe</span>
                          </div>
                          <Slider
                            defaultValue={[symptom.severity]}
                            value={[symptom.severity]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => {
                              const newSymptoms = [...symptoms];
                              newSymptoms[index].severity = value[0];
                              setSymptoms(newSymptoms);
                            }}
                          />
                          <div className="text-center text-sm font-medium text-[#3a2a76]">
                            {symptom.severity}/10
                          </div>
                        </div>
                      )}
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
                            setSymptoms([...symptoms, { 
                              label: newSymptom.trim(), 
                              selected: true,
                              severity: 0 
                            }]);
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

            {/* Step 4: Medications */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {Array.from(new Set(medications.map(med => med.category))).map(category => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-500">{category}</h3>
                    <div className="space-y-2">
                      {medications
                        .filter(med => med.category === category)
                        .map((med, index) => (
                          <div
                            key={med.name}
                            onClick={() => {
                              const newMeds = [...medications];
                              const medIndex = medications.findIndex(m => m.name === med.name);
                              newMeds[medIndex].taken = !newMeds[medIndex].taken;
                              setMedications(newMeds);
                            }}
                            className={`relative rounded-xl p-4 transition-all cursor-pointer ${
                              med.taken
                                ? 'bg-[#3a2a76]/10 border border-[#3a2a76]'
                                : 'bg-white/95 border border-gray-100 hover:border-[#3a2a76]/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-medium">{med.name}</span>
                                {med.dosage && (
                                  <span className="text-sm text-gray-500">
                                    {med.dosage.value} {med.dosage.unit}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {med.prescribed && (
                                  <Badge variant="secondary" className="text-xs">Prescribed</Badge>
                                )}
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center border cursor-pointer ${
                                    med.taken 
                                      ? 'bg-[#3a2a76] border-[#3a2a76]' 
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {med.taken && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            </div>
                            {med.taken && (
                              <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="number"
                                  value={med.dosage?.value || ""}
                                  onChange={(e) => {
                                    const newMeds = [...medications];
                                    const medIndex = medications.findIndex(m => m.name === med.name);
                                    newMeds[medIndex].dosage = {
                                      value: Number(e.target.value) || 0,
                                      unit: med.dosage?.unit || 'mg'
                                    };
                                    setMedications(newMeds);
                                  }}
                                  className="w-20 px-2 py-1 rounded-md border text-sm bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                                  placeholder="Dosage"
                                />
                                <Select
                                  value={med.dosage?.unit || "mg"}
                                  onValueChange={(value) => {
                                    const newMeds = [...medications];
                                    const medIndex = medications.findIndex(m => m.name === med.name);
                                    newMeds[medIndex].dosage = {
                                      value: med.dosage?.value || 0,
                                      unit: value
                                    };
                                    setMedications(newMeds);
                                  }}
                                >
                                  <SelectTrigger className="w-20 bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="mg">mg</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="ml">ml</SelectItem>
                                    <SelectItem value="mcg">mcg</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
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
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Dosage"
                        className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <Select defaultValue="mg">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mg">mg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="mcg">mcg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                                category: "Other",
                                dosage: { value: 0, unit: 'mg' }
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

          {/* Footer */}
          <div className="flex-shrink-0 pt-6 border-t border-gray-100 mt-6">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 border"
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
  )
}




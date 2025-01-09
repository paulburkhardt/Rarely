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
    { day: "Mon", value: isHealthSynced ? 4 : 3 },
    { day: "Tue", value: isHealthSynced ? 3 : 4 },
    { day: "Wed", value: isHealthSynced ? 4 : 2 },
    { day: "Thu", value: isHealthSynced ? 5 : 5 },
    { day: "Fri", value: isHealthSynced ? 3 : 4 },
    { day: "Sat", value: isHealthSynced ? 4 : 3 },
    { day: "Sun", value: isHealthSynced ? 5 : 4 },
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

  const handleHealthSync = () => {
    setIsHealthSynced(true);
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
        
        <Card className="bg-[#E6E3FD] border-none shadow-none">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-8 h-8">
              <BookOpen className="w-full h-full text-[#473F63]" />
            </div>
            <p className="text-[#473F63]">
              {hasDiaryEntry 
                ? "Want to update your daily tracking?"
                : "To understand your disease better we need to track your habits!"
              }
            </p>
            <Button 
              className="bg-[#473F63] hover:bg-[#473F63]/90 text-white"
              onClick={handleDiaryClick}
            >
              {hasDiaryEntry ? "Update Diary" : "Continue"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E6E3FD] shadow-sm">
          <CardContent className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AppleIcon className="w-6 h-6 text-black" />
              <div>
                <p className="font-medium text-[#473F63]">Apple Health</p>
                <p className="text-sm text-[#473F63]/70">
                  {isHealthSynced ? "Last synced: Just now" : "Sync your health data"}
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="border-[#473F63] text-[#473F63] hover:bg-[#E6E3FD]"
              onClick={handleHealthSync}
              disabled={isHealthSynced}
            >
              {isHealthSynced ? "Synced" : "Sync"}
            </Button>
          </CardContent>
        </Card>

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
                <div className="flex gap-2 mt-4">
                  <Button className="bg-[#473F63] text-white">View Details</Button>
                  <Button 
                    variant="outline" 
                    className="border-[#473F63] text-[#473F63]"
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


"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/Dashboard";
import { colors } from "@/styles/colors";
import BottomNav from "@/components/BottomNav";
import PleaseFillDiary from "@/components/PleaseFillDiary";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function WellnessDashboard() {

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">We're sorry</h1>
          <p className="text-gray-600">This web app is only accessible via mobile phone.</p>
        </div>
      </div>
    );
  }

  const [hasDiaryEntry, setHasDiaryEntry] = useState<boolean>(false);

  // Load the diary entry state from sessionStorage on component mount
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

  return (
    <div className="min-h-screen bg-white pb-0">
      <main className="container mx-auto px-4 py-8 pt-0">
        {!hasDiaryEntry ? (
          <PleaseFillDiary onButtonClick={handleDiaryClick}/>
        ) : (
          <Dashboard />
        )}
      </main>

      <BottomNav />
    </div>
  );
}


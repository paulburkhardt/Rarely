"use client"

import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

// Correctly define the prop type interface
interface PleaseFillDiaryProps {
  onButtonClick: () => void; // Define the prop type
}

// Ensure the component is exported correctly
export default function PleaseFillDiary({ onButtonClick }: PleaseFillDiaryProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white px-4 pt-20">
      <h1 className="text-4xl font-bold mb-0 text-center" style={{ color: "#4A4A4A" }}>
        Welcome back Ria!
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        You haven’t filled out your diary yet!
      </p>
      <Button 
        className="bg-purple-200 text-purple-800 hover:bg-purple-300 rounded-lg w-full max-w-md text-xl font-bold shadow-lg transition duration-200"
        style={{ height: '20vh' }}
        onClick={onButtonClick}>
        Fill out today’s diary!
      </Button>
      <BottomNav />
    </div>
  )
} 
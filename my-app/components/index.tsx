"use client"

import { useState, useEffect } from 'react'
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { colors } from "@/styles/colors"
import Link from "next/link"

export default function Dashboard() {
  const [hasDiaryEntry, setHasDiaryEntry] = useState(false)

  // Load diary entry state from localStorage on mount
  useEffect(() => {
    const storedHasDiaryEntry = localStorage.getItem('hasDiaryEntry') === 'true'
    setHasDiaryEntry(storedHasDiaryEntry)
  }, [])

  const handleDiaryClick = () => {
    setHasDiaryEntry(true)
    localStorage.setItem('hasDiaryEntry', 'true')
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        {!hasDiaryEntry ? (
          <>
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Welcome Back, Ria!
            </h1>
            <p className="text-lg" style={{ color: colors.text.secondary }}>
              You haven't filled out your diary yet
            </p>
            <Button
              onClick={handleDiaryClick}
              className="w-full max-w-sm py-8 rounded-2xl text-lg"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.background.primary 
              }}
            >
              Daily Diary
            </Button>
          </>
        ) : (
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Your dashboard content goes here.
          </p>
        )}
      </div>
    </Layout>
  )
}


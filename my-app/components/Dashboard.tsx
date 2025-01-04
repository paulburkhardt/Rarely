"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { colors } from "@/styles/colors";

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-white pb-0 pt-20">
      <main className="container mx-auto px-4 py-8 pt-0">
        {/* Welcome Section */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.text.primary }}>
            Thank you <span className="text-primary">Ria!</span>
          </h1>
        </div>

        {/* Progress Section */}
        <Card className="mb-6 border-gray-200 bg-white shadow-md rounded-3xl">
          <CardHeader className="p-4">
            <CardTitle className="text-xl" style={{ color: colors.text.primary }}>Our Collective Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>2</div>
              <h3 className="text-sm font-semibold">Gentherapies</h3>
              <p className="text-xs" style={{ color: colors.text.secondary }}>initiated</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>20</div>
              <h3 className="text-sm font-semibold">Daily Users</h3>
              <p className="text-xs" style={{ color: colors.text.secondary }}>and <span style={{ color: colors.secondary }}>growing</span></p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>200</div>
              <h3 className="text-sm font-semibold">Journal Entries</h3>
              <p className="text-xs" style={{ color: colors.text.secondary }}>yesterday</p>
            </div>
          </CardContent>
        </Card>

        {/* Your Impact Section */}
        <Card className="border-gray-200 bg-white shadow-md rounded-3xl mb-6">
          <CardHeader className="p-4">
            <CardTitle className="text-xl" style={{ color: colors.text.primary }}>Your Impact</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm text-center">
              <p className="text-xl font-bold" style={{ color: colors.text.primary }}>4</p>
              <p className="text-sm font-semibold">Daily Streaks</p>
              <p className="text-xs" style={{ color: colors.text.secondary }}>Consistency is <span style={{ color: colors.primary }}>key</span>!</p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-sm text-center">
              <p className="text-xl font-bold" style={{ color: colors.text.primary }}>200</p>
              <p className="text-sm font-semibold">Total Entries</p>
              <p className="text-xs" style={{ color: colors.text.secondary }}><span style={{ color: colors.secondary }}>Impressive</span> milestone!</p>
            </div>
          </CardContent>
        </Card>

        {/* Further Information Section */}
        <Card className="border-gray-200 bg-white shadow-md rounded-3xl">
          <CardHeader className="p-4">
            <CardTitle className="text-xl" style={{ color: colors.text.primary }}>Further Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/link1" className="text-blue-500 hover:underline">Link 1</Link>
              </li>
              <li>
                <Link href="/link2" className="text-blue-500 hover:underline">Link 2</Link>
              </li>
              <li>
                <Link href="/link3" className="text-blue-500 hover:underline">Link 3</Link>
              </li>
              <li>
                <Link href="/link4" className="text-blue-500 hover:underline">Link 4</Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


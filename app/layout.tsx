import "@/styles/globals.css"
import { Inter } from 'next/font/google'
import { BottomNav } from "@/components/bottom-nav"
import { UserProvider } from "@/contexts/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rarely - Health Tracking App",
  description: "Track your health habits and understand your disease better",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <UserProvider>
          <div className="max-w-md mx-auto min-h-screen pb-20">
            {children}
            <BottomNav />
          </div>
        </UserProvider>
      </body>
    </html>
  )
}


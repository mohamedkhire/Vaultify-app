'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from 'next-themes'
import { CollapsibleSidebar } from './CollapsibleSidebar'
import { ThemeToggle } from './theme-toggle'
import { verifyToken } from '@/lib/auth'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken')
        const currentUser = localStorage.getItem('currentUser')
        if (!token || !currentUser || !verifyToken(token)) {
          router.push('/')
        } else {
          setIsAuthenticated(true)
        }
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vaultLocked', 'true')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
      router.push('/')
    }
  }

  if (!isClient || !isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      <CollapsibleSidebar onLogout={handleLogout} />
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden ml-0 md:ml-64 transition-all duration-300">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="container mx-auto max-w-7xl">
            <Card className="shadow-lg bg-card/50 backdrop-blur-md border border-border">
              <CardContent className="p-6 space-y-6">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  {children}
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}


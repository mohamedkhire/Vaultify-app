'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveSidebar } from './responsive-sidebar'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { Bell, Settings, HelpCircle, Menu } from 'lucide-react'
import { NotificationsPopover } from './notifications-popover'
import { SettingsDialog } from './settings-dialog'
import { useTheme } from 'next-themes'
import { Onboarding } from './Onboarding'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Toaster } from 'react-hot-toast'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted')
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const completeOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('onboardingCompleted', 'true')
  }

  if (!mounted) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-secondary/10">
        <ResponsiveSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <main className="transition-all duration-300 flex flex-col min-h-screen lg:ml-64">
          <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
            <div className="max-w-8xl mx-auto">
              <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
                <div className="relative flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <div className="relative flex items-center ml-auto">
                    <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
                      <ul className="flex space-x-8">
                        <li>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setShowOnboarding(true)}>
                                <HelpCircle className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Get help or restart the onboarding process</p>
                            </TooltipContent>
                          </Tooltip>
                        </li>
                        <li>
                          <NotificationsPopover>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Bell className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View notifications</p>
                              </TooltipContent>
                            </Tooltip>
                          </NotificationsPopover>
                        </li>
                        <li>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                                <Settings className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open settings</p>
                            </TooltipContent>
                          </Tooltip>
                        </li>
                        <li>
                          <ThemeToggle />
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="px-4 sm:px-6 lg:px-8 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-8xl mx-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
          <footer className="mt-auto py-4 text-center text-sm text-muted-foreground">
            <p>Built with ♥ by <a href="https://mohamedkhire.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mohamed Khire</a></p>
          </footer>
        </main>
        <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
        <Toaster />
      </div>
    </TooltipProvider>
  )
}


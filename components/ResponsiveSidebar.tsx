'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Key, Lock, LogOut, Home, FileText, CheckSquare, X, Menu } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from 'framer-motion'

const navItems = [
  { href: '/dashboard', icon: Home, text: 'Dashboard' },
  { href: '/generate', icon: Key, text: 'Generate' },
  { href: '/vault', icon: Lock, text: 'Vault' },
  { href: '/notes', icon: FileText, text: 'Notes' },
  { href: '/security-check', icon: CheckSquare, text: 'Security Check' },
]

interface ResponsiveSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResponsiveSidebar({ open, onOpenChange }: ResponsiveSidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-primary mr-2" />
          <span className="text-2xl font-bold text-foreground">Vaultify</span>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>
      <ul className="space-y-4 flex-grow">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => isMobile && onOpenChange(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.text}
                </Button>
              </motion.div>
            </Link>
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="w-full justify-start mt-auto" asChild>
        <Link href="/logout">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Link>
      </Button>
    </>
  )

  return (
    <>
      <Sheet open={isMobile && open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-6 z-50">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <nav className={cn(
        "w-64 bg-card p-6 flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 z-40",
        isMobile ? "-translate-x-full" : "translate-x-0"
      )}>
        <SidebarContent />
      </nav>
    </>
  )
}


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
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
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
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-base",
                pathname === item.href && "bg-primary text-primary-foreground"
              )}
              onClick={() => isMobile && onOpenChange(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.text}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/logout">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Sheet open={isMobile && open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background transition-transform duration-300 ease-in-out transform",
        isMobile ? "-translate-x-full" : "translate-x-0"
      )}>
        <SidebarContent />
      </aside>
    </>
  )
}


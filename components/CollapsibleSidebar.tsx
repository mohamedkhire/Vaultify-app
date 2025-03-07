'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, KeyRound, Vault, Notebook, ShieldCheck, LogOut, Menu } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
  { href: '/generate', icon: KeyRound, text: 'Generate' },
  { href: '/vault', icon: Vault, text: 'Vault' },
  { href: '/notes', icon: Notebook, text: 'Notes' },
  { href: '/security-check', icon: ShieldCheck, text: 'Security Check' },
]

interface CollapsibleSidebarProps {
  onLogout: () => void
}

export function CollapsibleSidebar({ onLogout }: CollapsibleSidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
      <div className="flex items-center mb-8">
        <KeyRound className="w-8 h-8 text-primary mr-2" />
        <span className="text-2xl font-bold text-primary">Vaultify</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.text}</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {item.text}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  )

  return (
    <TooltipProvider>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-full bg-card/50 backdrop-blur-md px-4 py-8">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card/50 backdrop-blur-md border-r border-border px-4 py-8">
          <SidebarContent />
        </aside>
      )}
    </TooltipProvider>
  )
}


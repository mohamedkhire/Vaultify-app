'use client'

import Link from 'next/link'
import { Shield, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">Vaultify</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="https://github.com/mohamedkhire" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}


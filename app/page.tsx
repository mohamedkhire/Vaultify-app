/*
 * Project: Vaultify App
 * Author: Mohamed Khire
 * Date: Mar 2025
 * Description: Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://vaultifyapp.vercel.app/
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Shield, Key, Lock } from 'lucide-react'
import { AuthModal } from '@/components/AuthModal'
import { DemoModal } from '@/components/DemoModal'
import { useToast } from '@/components/ui/use-toast'
import { useTheme } from 'next-themes'

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const { toast } = useToast()
  const { theme } = useTheme()

  const handleAuthSuccess = (username: string) => {
    setIsAuthModalOpen(false)
    toast({ description: `Welcome, ${username}!` })
    // In a real app, you'd handle authentication state here
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme === 'dark' ? 'bg-grid-dark' : 'bg-grid-light'}`}>
      <div className="grid-mask absolute inset-0 z-0"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 z-10"
      >
        <div className="flex items-center justify-center mb-8">
          <Shield className="w-16 h-16 text-primary mr-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-primary">Vaultify</h1>
        </div>
        <p className="text-xl md:text-2xl max-w-md mx-auto text-foreground/80">
          Secure your digital life with our advanced password manager.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Get Started
          </Button>
          <Button 
            onClick={() => setIsDemoModalOpen(true)}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Try Demo
          </Button>
        </div>
      </motion.div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  )
}


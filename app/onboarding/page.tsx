/*
 * Project: Vaultify App
 * Author: Mohamed Khire
 * Date: Mar 2025
 * Description: Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://vaultifyapp.vercel.app/
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/components/ui/use-toast'
import { Shield, Key, Lock, CheckCircle, Loader2 } from 'lucide-react'
import { AnimatedTransition } from '@/components/animated-transition'
import { encryptPassword } from '@/lib/encryption'
import { addPassword } from '@/lib/passwordUtils'
import { useTheme } from 'next-themes'
import useNotification from '@/lib/hooks/useNotification'
import { usePasswords } from '@/contexts/PasswordContext'

const steps = [
  {
    title: 'Welcome to Vaultify',
    content: 'Vaultify is your secure vault for all your passwords and sensitive information. Let\'s get you set up!',
    icon: Shield,
  },
  {
    title: 'Create Your Master Password',
    content: 'This password will be used to encrypt all your data. Make sure it\'s strong and memorable!',
    icon: Key,
  },
  {
    title: 'Add Your First Password',
    content: 'Let\'s add your first password to the vault. Don\'t worry, you can always add more later!',
    icon: Lock,
  },
  {
    title: 'You\'re All Set!',
    content: 'Congratulations! You\'re now ready to use Vaultify. Remember to keep your master password safe.',
    icon: CheckCircle,
  },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [masterPassword, setMasterPassword] = useState('')
  const [firstPassword, setFirstPassword] = useState({ name: '', value: '' })
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { addNotification } = useNotification()
  const { addPassword } = usePasswords()

  // Set initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
  }, [setTheme])

  const handleNext = () => {
    if (currentStep === 1 && masterPassword.length < 12) {
      toast({ description: 'Master password should be at least 12 characters long', variant: 'destructive' })
      return
    }
    if (currentStep === 2 && (!firstPassword.name || !firstPassword.value)) {
      toast({ description: 'Please enter both name and password', variant: 'destructive' })
      return
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      finishOnboarding()
    }
  }

  const finishOnboarding = () => {
    setIsLoading(true)
    localStorage.setItem('onboardingCompleted', 'true')
    localStorage.setItem('masterPassword', btoa(masterPassword))
    
    // Save the first password to the vault without encryption
    const newPassword = {
      name: firstPassword.name,
      category: 'General',
      currentVersion: {
        value: firstPassword.value, // Save the actual password value
        createdAt: new Date(),
      },
      history: [],
      tags: [],
    }
    addPassword(newPassword)
    
    localStorage.setItem('vaultLocked', 'true')
    toast({ description: 'Onboarding completed successfully!' })
    setTimeout(() => router.push('/dashboard'), 1000)
  }

  const StepIcon = steps[currentStep].icon

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <AnimatedTransition>
        <Card className="w-full max-w-md bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <StepIcon className="w-8 h-8 mr-2 text-primary" />
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">{steps[currentStep].content}</p>
            {currentStep === 1 && (
              <div className="space-y-2">
                <Label htmlFor="masterPassword">Master Password</Label>
                <Input
                  id="masterPassword"
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter your master password"
                />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-2">
                <Label htmlFor="passwordName">Password Name</Label>
                <Input
                  id="passwordName"
                  type="text"
                  value={firstPassword.name}
                  onChange={(e) => setFirstPassword({ ...firstPassword, name: e.target.value })}
                  placeholder="e.g., My Email Password"
                />
                <Label htmlFor="passwordValue">Password</Label>
                <Input
                  id="passwordValue"
                  type="password"
                  value={firstPassword.value}
                  onChange={(e) => setFirstPassword({ ...firstPassword, value: e.target.value })}
                  placeholder="Enter your password"
                />
              </div>
            )}
            <Button 
              onClick={handleNext} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
              disabled={
                (currentStep === 1 && masterPassword.length < 12) ||
                (currentStep === 2 && (!firstPassword.name || !firstPassword.value))
              }
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </CardContent>
        </Card>
      </AnimatedTransition>
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </motion.div>
        </div>
      )}
    </div>
  )
}


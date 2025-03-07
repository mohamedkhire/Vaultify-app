import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Key, Lock, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useNotification from '@/hooks/useNotification'
import { usePasswords } from '@/contexts/PasswordContext'

const steps = [
  {
    title: 'Welcome to Vaultify',
    content: 'Vaultify is your secure vault for all your passwords and sensitive information. Let\'s get you set up!',
    icon: Shield,
  },
  {
    title: 'Create Your Master Password',
    content: 'This password will be used to encrypt all your data. Make sure it\'s strong and memorable. We recommend using a passphrase of at least 4 random words.',
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

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [masterPassword, setMasterPassword] = useState('')
  const [firstPassword, setFirstPassword] = useState({ name: '', value: '' })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showSuccess, showError } = useNotification()
  const { addPassword } = usePasswords()

  useEffect(() => {
    // Check if the user is authenticated
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      router.push('/')
    }
  }, [router])

  const handleNext = () => {
    if (currentStep === 1 && masterPassword.length < 12) {
      showError('Master password should be at least 12 characters long')
      return
    }
    if (currentStep === 2 && (!firstPassword.name || !firstPassword.value)) {
      showError('Please enter both name and password')
      return
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      finishOnboarding()
    }
  }

  const finishOnboarding = async () => {
    setIsLoading(true)
    try {
      localStorage.setItem('onboardingCompleted', 'true')
      localStorage.setItem('masterPassword', btoa(masterPassword))
      
      const newPassword = {
        name: firstPassword.name,
        category: 'General',
        currentVersion: {
          value: firstPassword.value,
          createdAt: new Date(),
        },
        history: [],
        tags: [],
      }
      await addPassword(newPassword)
      
      localStorage.setItem('vaultLocked', 'false')
      showSuccess('Onboarding completed successfully!')
      
      // Use replace instead of push to prevent going back to onboarding
      router.replace('/dashboard')
    } catch (error) {
      showError('An error occurred during onboarding. Please try again.')
      console.error('Onboarding error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const StepIcon = steps[currentStep].icon

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
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
            disabled={isLoading || (currentStep === 1 && masterPassword.length < 12) || (currentStep === 2 && (!firstPassword.name || !firstPassword.value))}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


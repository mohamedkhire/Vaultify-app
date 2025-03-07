import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import useNotification from '@/lib/hooks/useNotification'

interface MasterPasswordPromptProps {
  onUnlock: () => void
}

export function MasterPasswordPrompt({ onUnlock }: MasterPasswordPromptProps) {
  const [password, setPassword] = useState('')
  const { showSuccess, showError } = useNotification()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const storedPassword = localStorage.getItem('masterPassword')
    if (storedPassword && btoa(password) === storedPassword) {
      onUnlock()
      localStorage.setItem('vaultLocked', 'false')
      showSuccess('Vault successfully unlocked. Welcome back!', 4000)
    } else {
      showError('Incorrect master password. Please try again.', 4000)
      // Add a delay before allowing another attempt
      setTimeout(() => {
        setPassword('')
      }, 1000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <Lock className="w-6 h-6 mr-2 text-primary" />
            Unlock Your Vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter your master password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}


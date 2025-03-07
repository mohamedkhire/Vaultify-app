import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'
import useNotification from '@/lib/hooks/useNotification'
import { generateToken } from '@/lib/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (username: string) => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { showSuccess, showError } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (activeTab === 'login') {
        const storedPassword = localStorage.getItem(username)
        if (!storedPassword || storedPassword !== password) {
          showError('Invalid username or password')
          return
        }
        const token = generateToken(username)
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', username)
        showSuccess('Login successful!')
        router.push('/dashboard')
      } else {
        if (localStorage.getItem(username)) {
          showError('Username already exists')
          return
        }
        const token = generateToken(username)
        localStorage.setItem(username, password)
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', username)
        localStorage.setItem('vaultLocked', 'true')
        // Clear any existing data for the new user
        localStorage.removeItem(`${username}_passwords`)
        localStorage.removeItem(`${username}_encryptedNotes`)
        localStorage.removeItem(`${username}_recentActivities`)
        showSuccess('Account created successfully!')
        router.push('/onboarding')
      }
      
      onSuccess(username)
      onClose()
    } catch (error) {
      showError('An error occurred. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] card-glass">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-center">
            <Shield className="w-6 h-6 mr-2 text-primary" />
            Welcome to Vaultify
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="login">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newUsername">Username</Label>
                  <Input id="newUsername" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="newPassword">Password</Label>
                  <Input id="newPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
            </TabsContent>
            <Button type="submit" className="w-full mt-4">
              {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </motion.form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}


'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Copy, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculatePasswordStrength, getStrengthLabel, getStrengthColor } from '@/lib/passwordUtils'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    generatePassword()
  }, [length])

  const generatePassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
    setStrength(calculatePasswordStrength(result));
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Vaultify Demo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Input
                  value={showPassword ? password : '•'.repeat(password.length)}
                  readOnly
                  className="pr-20 font-mono text-lg"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <AnimatePresence>
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Strength:</span>
                  <span className="font-semibold">{getStrengthLabel(strength)}</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getStrengthColor(strength)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${strength}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Password Length: {length}</Label>
              <Slider
                min={8}
                max={32}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={generatePassword} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Password
            </Button>
            <Button onClick={onClose} variant="outline">
              Close Demo
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Want more features?</p>
            <Button variant="default" className="w-full">
              Try the Full App
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


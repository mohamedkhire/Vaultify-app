'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, RefreshCw } from 'lucide-react'
import { calculatePasswordStrength, getStrengthLabel, getStrengthColor, getPasswordSuggestions } from '@/lib/passwordUtils'
import useNotification from '@/lib/hooks/useNotification'


export default function PasswordStrengthTester() {
  const { showSuccess, showError, showInfo } = useNotification()
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(0)

  const testStrength = () => {
    const newStrength = calculatePasswordStrength(password)
    setStrength(newStrength)
    
    if (newStrength >= 80) {
      showSuccess('This is a strong password!', 3000)
    } else if (newStrength >= 60) {
      showInfo('This password has moderate strength. Consider making it stronger.', 4000)
    } else {
      showError('This password is weak. Please follow the suggestions below to improve it.', 4000)
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
    let newPassword = ''
    for (let i = 0; i < 16; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(newPassword)
    testStrength()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    showSuccess('Password has been copied to clipboard', 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Password Strength Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password to test"
          />
          <Button onClick={testStrength}>Test</Button>
          <Button onClick={generatePassword} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate
          </Button>
          <Button onClick={copyToClipboard} variant="outline">Copy</Button>
        </div>
        {strength > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span>Strength: {getStrengthLabel(strength)}</span>
              <span>{strength}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${getStrengthColor(strength)}`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>
            <ul className="list-disc list-inside mt-2">
              {getPasswordSuggestions(password).map((suggestion, index) => (
                <li key={index} className="text-sm text-muted-foreground">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


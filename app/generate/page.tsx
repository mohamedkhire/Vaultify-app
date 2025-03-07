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
import dynamic from 'next/dynamic'
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key } from 'lucide-react'
import { usePasswords } from '@/contexts/PasswordContext'
import useNotification from '@/hooks/useNotification'

// Dynamically import the PasswordGeneratorCard component
const PasswordGeneratorCard = dynamic(() => import('@/components/PasswordGeneratorCard'), {
  ssr: false,
})

// Dynamically import the PasswordStrengthTester component
const PasswordStrengthTester = dynamic(() => import('@/components/PasswordStrengthTester'), {
  ssr: false,
})

export default function GeneratePasswordPage() {
  const { addPassword } = usePasswords()
  const { showSuccess, showError, showInfo } = useNotification()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSavePassword = (password: string) => {
    if (!isClient) return

    const timestamp = new Date().toLocaleTimeString()
    addPassword({
      name: `Generated Password (${timestamp})`,
      category: 'Generated',
      currentVersion: {
        value: password,
        createdAt: new Date(),
      },
      history: [],
      tags: ['generated'],
    })
    showSuccess('Your generated password has been saved to the vault successfully')
  }

  const handleCopyPassword = (password: string) => {
    if (!isClient) return

    navigator.clipboard.writeText(password)
    showSuccess('Password copied to clipboard successfully')
  }

  const handleGeneratePassword = (password: string, strength: number) => {
    if (!isClient) return

    if (strength >= 80) {
      showSuccess('Strong password generated! This password provides excellent security.')
    } else if (strength >= 60) {
      showInfo('Moderate strength password generated. Consider adding more complexity.')
    } else {
      showError('This password is weak. Try adding length, special characters, or numbers.')
    }
  }

  if (!isClient) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <Card className="w-full bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Key className="w-6 h-6 mr-2 text-primary" />
            Password Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PasswordGeneratorCard 
            onSave={handleSavePassword}
            onCopy={handleCopyPassword}
            onGenerate={handleGeneratePassword}
          />
          <PasswordStrengthTester />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}


'use client'

import { useState } from 'react'
import { DashboardLayout } from "@/components/DashboardLayout"
import { PasswordGeneratorCard } from '@/components/PasswordGeneratorCard'
import { PasswordStrengthTester } from '@/components/PasswordStrengthTester'
import { usePasswords } from '@/contexts/PasswordContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key } from 'lucide-react'

export default function GeneratePasswordPage() {
  const { addPassword } = usePasswords()

  const savePassword = (password: string) => {
    addPassword({
      name: `Generated Password ${Date.now()}`,
      category: 'Generated',
      currentVersion: {
        value: password,
        createdAt: new Date(),
      },
      history: [],
      tags: [],
    })
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
          <PasswordGeneratorCard onSave={savePassword} />
          <PasswordStrengthTester />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}


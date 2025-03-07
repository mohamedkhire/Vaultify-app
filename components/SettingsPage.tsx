'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Settings, Save } from 'lucide-react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimatedTransition } from '@/components/animated-transition'
import useNotification from '@/lib/hooks/useNotification'

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
}

export default function SettingsPage() {
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
  })
  const router = useRouter()
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('username')) {
        router.push('/login')
      } else {
        const storedPolicy = JSON.parse(localStorage.getItem('passwordPolicy') || '{}')
        if (Object.keys(storedPolicy).length > 0) {
          setPasswordPolicy(storedPolicy)
        }
      }
    }
  }, [router])

  const handlePolicyChange = (key: keyof PasswordPolicy, value: number | boolean) => {
    setPasswordPolicy(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    localStorage.setItem('passwordPolicy', JSON.stringify(passwordPolicy))
    showSuccess('Settings saved successfully!')
  }

  return (
    <DashboardLayout>
      <AnimatedTransition>
        <Card className="w-full bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Settings className="w-6 h-6 mr-2 text-primary" />
              Password Policy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Password Length</Label>
              <Input
                id="minLength"
                type="number"
                value={passwordPolicy.minLength}
                onChange={(e) => handlePolicyChange('minLength', parseInt(e.target.value))}
                min={8}
                max={32}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="requireUppercase">Require Uppercase</Label>
                <Switch
                  id="requireUppercase"
                  checked={passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => handlePolicyChange('requireUppercase', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requireLowercase">Require Lowercase</Label>
                <Switch
                  id="requireLowercase"
                  checked={passwordPolicy.requireLowercase}
                  onCheckedChange={(checked) => handlePolicyChange('requireLowercase', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requireNumbers">Require Numbers</Label>
                <Switch
                  id="requireNumbers"
                  checked={passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => handlePolicyChange('requireNumbers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requireSymbols">Require Symbols</Label>
                <Switch
                  id="requireSymbols"
                  checked={passwordPolicy.requireSymbols}
                  onCheckedChange={(checked) => handlePolicyChange('requireSymbols', checked)}
                />
              </div>
            </div>
            <Button onClick={saveSettings} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </AnimatedTransition>
    </DashboardLayout>
  )
}


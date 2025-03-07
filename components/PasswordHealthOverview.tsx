import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { Password } from '@/lib/types'
import { calculatePasswordStrength } from '@/lib/passwordUtils'

interface PasswordHealthOverviewProps {
  passwords: Password[]
}

export function PasswordHealthOverview({ passwords }: PasswordHealthOverviewProps) {
  const totalPasswords = passwords.length
  const weakPasswords = passwords.filter(pw => calculatePasswordStrength(pw.currentVersion.value) < 60)
  const reusedPasswords = findReusedPasswords(passwords)
  const averageStrength = totalPasswords > 0 ? calculateAverageStrength(passwords) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <HealthCard
        title="Total Passwords"
        value={totalPasswords}
        icon={<Shield className="h-5 w-5 text-primary" />}
      />
      <HealthCard
        title="Weak Passwords"
        value={weakPasswords.length}
        icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
        percentage={totalPasswords > 0 ? (weakPasswords.length / totalPasswords) * 100 : 0}
      />
      <HealthCard
        title="Reused Passwords"
        value={reusedPasswords.length}
        icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
        percentage={totalPasswords > 0 ? (reusedPasswords.length / totalPasswords) * 100 : 0}
      />
      <HealthCard
        title="Average Strength"
        value={`${averageStrength.toFixed(0)}%`}
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        percentage={averageStrength}
      />
    </div>
  )
}

function HealthCard({ title, value, icon, percentage }: { title: string; value: string | number; icon: React.ReactNode; percentage?: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentage !== undefined && (
          <Progress
            value={percentage}
            className={`h-2 mt-2 ${
              percentage >= 80 ? "bg-green-500" :
              percentage >= 60 ? "bg-yellow-500" :
              "bg-red-500"
            }`}
          />
        )}
      </CardContent>
    </Card>
  )
}

function findReusedPasswords(passwords: Password[]): Password[] {
  const passwordMap = new Map<string, Password[]>()
  passwords.forEach(pw => {
    const existing = passwordMap.get(pw.currentVersion.value) || []
    passwordMap.set(pw.currentVersion.value, [...existing, pw])
  })
  return Array.from(passwordMap.values()).filter(group => group.length > 1).flat()
}

function calculateAverageStrength(passwords: Password[]): number {
  if (passwords.length === 0) return 0
  const totalStrength = passwords.reduce((sum, pw) => sum + calculatePasswordStrength(pw.currentVersion.value), 0)
  return totalStrength / passwords.length
}


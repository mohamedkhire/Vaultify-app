import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Password } from '@/lib/securityCheck'
import { calculatePasswordStrength } from '@/lib/passwordUtils'

interface DashboardOverviewProps {
  passwords: Password[]
}

export function DashboardOverview({ passwords }: DashboardOverviewProps) {
  const totalPasswords = passwords.length
  const weakPasswords = passwords.filter(pw => calculatePasswordStrength(pw.currentVersion?.value || '') < 60)
  const reusedPasswords = findReusedPasswords(passwords)
  const averageStrength = totalPasswords > 0 ? calculateAverageStrength(passwords) : 0

  return (
    <>
      <StatCard
        title="Total Passwords"
        value={totalPasswords}
        icon={<Key className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Weak Passwords"
        value={weakPasswords.length}
        icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        subtext={totalPasswords > 0 ? `${((weakPasswords.length / totalPasswords) * 100).toFixed(1)}% of total` : 'No passwords'}
      />
      <StatCard
        title="Reused Passwords"
        value={reusedPasswords.length}
        icon={<Lock className="h-4 w-4 text-muted-foreground" />}
        subtext={totalPasswords > 0 ? `${((reusedPasswords.length / totalPasswords) * 100).toFixed(1)}% of total` : 'No passwords'}
      />
      <StatCard
        title="Average Strength"
        value={`${averageStrength.toFixed(1)}%`}
        icon={<Shield className="h-4 w-4 text-muted-foreground" />}
        progress={averageStrength}
      />
    </>
  )
}

function StatCard({ title, value, icon, subtext, progress }: { title: string; value: string | number; icon: React.ReactNode; subtext?: string; progress?: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-2" />
        )}
      </CardContent>
    </Card>
  )
}

function findReusedPasswords(passwords: Password[]): Password[] {
  const passwordMap = new Map<string, Password[]>()
  passwords.forEach(pw => {
    const value = pw.currentVersion?.value || ''
    const existing = passwordMap.get(value) || []
    passwordMap.set(value, [...existing, pw])
  })
  return Array.from(passwordMap.values()).filter(group => group.length > 1).flat()
}

function calculateAverageStrength(passwords: Password[]): number {
  if (passwords.length === 0) return 0
  const totalStrength = passwords.reduce((sum, pw) => sum + calculatePasswordStrength(pw.currentVersion?.value || ''), 0)
  return totalStrength / passwords.length
}


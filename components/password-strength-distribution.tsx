"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePasswordStrength } from "@/lib/passwordUtils"
import type { Password } from "@/lib/types"

interface PasswordStrengthDistributionProps {
  passwords: Password[]
}

export function PasswordStrengthDistribution({ passwords }: PasswordStrengthDistributionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate strength distribution
  const weak = passwords.filter((pw) => calculatePasswordStrength(pw.currentVersion?.value || "") < 60).length
  const moderate = passwords.filter((pw) => {
    const strength = calculatePasswordStrength(pw.currentVersion?.value || "")
    return strength >= 60 && strength < 80
  }).length
  const strong = passwords.filter((pw) => calculatePasswordStrength(pw.currentVersion?.value || "") >= 80).length

  const total = passwords.length
  const weakPercent = total > 0 ? (weak / total) * 100 : 0
  const moderatePercent = total > 0 ? (moderate / total) * 100 : 0
  const strongPercent = total > 0 ? (strong / total) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Password Strength Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${weakPercent}%` }}
              title={`Weak: ${weak} passwords (${weakPercent.toFixed(1)}%)`}
            />
            <div
              className="bg-yellow-500 transition-all duration-500"
              style={{ width: `${moderatePercent}%` }}
              title={`Moderate: ${moderate} passwords (${moderatePercent.toFixed(1)}%)`}
            />
            <div
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${strongPercent}%` }}
              title={`Strong: ${strong} passwords (${strongPercent.toFixed(1)}%)`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1" />
                <span>Weak</span>
              </div>
              <span className="text-muted-foreground">
                {weak} ({weakPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1" />
                <span>Moderate</span>
              </div>
              <span className="text-muted-foreground">
                {moderate} ({moderatePercent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1" />
                <span>Strong</span>
              </div>
              <span className="text-muted-foreground">
                {strong} ({strongPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


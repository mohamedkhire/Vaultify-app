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
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Clock } from 'lucide-react'
import { performSecurityCheck, SecurityCheckResult } from '@/lib/securityCheck'
import { DashboardLayout } from "@/components/DashboardLayout"
import { AnimatedTransition } from '@/components/animated-transition'
import { usePasswords } from '@/contexts/PasswordContext'
import useNotification from '@/lib/hooks/useNotification'
import { logActivity } from '@/components/RecentActivity'

export default function SecurityCheck() {
  const [securityResult, setSecurityResult] = useState<SecurityCheckResult | null>(null)
  const [lastCheckDate, setLastCheckDate] = useState<string | null>(null)
  const router = useRouter()
  const { passwords, loading } = usePasswords()
  const { showSuccess, showError, showInfo } = useNotification()

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      router.push('/')
    } else if (!loading) {
      // Load last check date
      const lastCheck = localStorage.getItem('lastSecurityCheck')
      if (lastCheck) {
        setLastCheckDate(lastCheck)
        const lastResult = JSON.parse(localStorage.getItem('lastSecurityResult') || 'null')
        if (lastResult) {
          setSecurityResult(lastResult)
        }
      }
    }
  }, [router, loading])

  const runSecurityCheck = () => {
    const result = performSecurityCheck(passwords)
    setSecurityResult(result)
    
    // Save check results and date
    const currentDate = new Date().toLocaleString()
    localStorage.setItem('lastSecurityCheck', currentDate)
    localStorage.setItem('lastSecurityResult', JSON.stringify(result))
    setLastCheckDate(currentDate)
    
    // Log the security check activity
    logActivity('security_check', 'Security Check')
    
    // Show overall score notification
    if (result.overallScore >= 90) {
      showSuccess('Security Check Complete: Excellent security score! Your passwords are well-protected.', 5000)
    } else if (result.overallScore >= 70) {
      showInfo('Security Check Complete: Good security score, but there\'s room for improvement.', 5000)
    } else {
      showError('Security Check Complete: Your password security needs attention. Please review the recommendations below.', 5000)
    }

    // Show specific issue notifications with delays
    setTimeout(() => {
      if (result.weakPasswords.length > 0) {
        showError(`Found ${result.weakPasswords.length} weak passwords that need strengthening.`, 6000)
      }
    }, 1000)
    
    setTimeout(() => {
      if (result.reusedPasswords.length > 0) {
        showError(`Found ${result.reusedPasswords.length} reused passwords. Consider using unique passwords.`, 6000)
      }
    }, 2000)
    
    setTimeout(() => {
      if (result.oldPasswords.length > 0) {
        showInfo(`Found ${result.oldPasswords.length} passwords that haven't been updated in 6 months.`, 6000)
      }
    }, 3000)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <AnimatedTransition>
        <div className="space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-primary" />
                  Security Check
                </div>
                {lastCheckDate && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Last check: {lastCheckDate}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!securityResult ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Run a security check to analyze your passwords and identify potential vulnerabilities.
                  </p>
                  <Button onClick={runSecurityCheck} className="w-full md:w-auto">
                    <Shield className="mr-2 h-4 w-4" />
                    Start Security Check
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Overall Security Score</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{securityResult.overallScore}%</span>
                    </div>
                  </div>
                  <Progress value={securityResult.overallScore} className="w-full h-2" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SecurityIssueCard
                      title="Weak Passwords"
                      count={securityResult.weakPasswords.length}
                      icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
                    />
                    <SecurityIssueCard
                      title="Reused Passwords"
                      count={securityResult.reusedPasswords.length}
                      icon={<AlertTriangle className="w-6 h-6 text-orange-500" />}
                    />
                    <SecurityIssueCard
                      title="Old Passwords"
                      count={securityResult.oldPasswords.length}
                      icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                    />
                  </div>

                  <Button onClick={runSecurityCheck} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Security Check Again
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AnimatedTransition>
    </DashboardLayout>
  )
}

function SecurityIssueCard({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 font-semibold">{title}</h3>
        </div>
        <span className="text-2xl font-bold">{count}</span>
      </CardContent>
    </Card>
  )
}


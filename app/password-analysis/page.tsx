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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle } from 'lucide-react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimatedTransition } from '@/components/animated-transition'

interface Password {
  id: number;id: number;
  name: string;
  currentVersion: {
    value: string;
    createdAt: Date;
  };
}

export default function PasswordAnalysis() {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [duplicatePasswords, setDuplicatePasswords] = useState<{ [key: string]: Password[] }>({})
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('username')) {
      router.push('/login')
    } else {
      const storedPasswords: Password[] = JSON.parse(localStorage.getItem('passwords') || '[]')
      setPasswords(storedPasswords)
      findDuplicatePasswords(storedPasswords)
    }
  }, [router])

  const findDuplicatePasswords = (passwords: Password[]) => {
    const passwordMap: { [key: string]: Password[] } = {}
    passwords.forEach(password => {
      if (passwordMap[password.currentVersion.value]) {
        passwordMap[password.currentVersion.value].push(password)
      } else {
        passwordMap[password.currentVersion.value] = [password]
      }
    })

    const duplicates = Object.entries(passwordMap)
      .filter(([_, group]) => group.length > 1)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    setDuplicatePasswords(duplicates)
  }

  return (
    <DashboardLayout>
      <AnimatedTransition>
        <Card className="w-full bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-primary" />
              Password Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Duplicate Passwords</h2>
            {Object.keys(duplicatePasswords).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Password</TableHead>
                    <TableHead>Accounts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(duplicatePasswords).map(([password, accounts]) => (
                    <TableRow key={password}>
                      <TableCell className="font-mono">{'•'.repeat(password.length)}</TableCell>
                      <TableCell>
                        <ul>
                          {accounts.map(account => (
                            <li key={account.id}>{account.name}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No duplicate passwords found. Great job!</p>
            )}
          </CardContent>
        </Card>
      </AnimatedTransition>
    </DashboardLayout>
  )
}


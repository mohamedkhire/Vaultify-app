/*
 * Project: Vaultify App
 * Author: Mohamed Khire
 * Date: Mar 2025
 * Description: Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://vaultifyapp.vercel.app/
 */

"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { PasswordHealthOverview } from "@/components/PasswordHealthOverview"
import { RecentActivity } from "@/components/RecentActivity"
import { PasswordStrengthDistribution } from "@/components/password-strength-distribution"
import { usePasswords } from "@/contexts/PasswordContext"
import useNotification from "@/lib/hooks/useNotification"

export default function Dashboard() {
  const { passwords, loading } = usePasswords()
  const { showInfo } = useNotification()

  useEffect(() => {
    // Removed the automatic welcome notification that was here
  }, [loading, showInfo])

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <PasswordHealthOverview passwords={passwords} />

        <div className="grid gap-6 md:grid-cols-2">
          <PasswordStrengthDistribution passwords={passwords} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-medium">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Use a unique password for each account</li>
              <li>Enable two-factor authentication when available</li>
              <li>Regularly update your passwords</li>
              <li>Avoid using personal information in your passwords</li>
              <li>Consider using a passphrase instead of a single word</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}


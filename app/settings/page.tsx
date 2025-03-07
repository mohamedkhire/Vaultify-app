/*
 * Project: Vaultify App
 * Author: Mohamed Khire
 * Date: Mar 2025
 * Description: Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://vaultifyapp.vercel.app/
 */
'use client'

import dynamic from 'next/dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Toast } from '@/components/ui/toast'
import { Settings, Save } from 'lucide-react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimatedTransition } from '@/components/animated-transition'

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
}

export default dynamic(() => import('@/components/SettingsPage'), { ssr: false })


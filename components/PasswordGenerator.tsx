'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Copy, RefreshCw } from 'lucide-react'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { generatePassword, calculatePasswordStrength } from '@/lib/passwordUtils'

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void
}

export function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    generateNewPassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const generateNewPassword = () => {
    const newPassword = generatePassword(length, {
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    })
    setPassword(newPassword)
    onGenerate(newPassword)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Password Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="pr-20 font-mono text-lg"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="mr-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
            >
              <motion.div
                animate={copied ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Copy className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>
        </div>

        <PasswordStrengthMeter password={password} />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Password Length: {length}</Label>
            <Slider
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
              <Label htmlFor="uppercase">Include Uppercase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
              <Label htmlFor="lowercase">Include Lowercase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
              <Label htmlFor="numbers">Include Numbers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
              <Label htmlFor="symbols">Include Symbols</Label>
            </div>
          </div>
        </div>

        <Button onClick={generateNewPassword} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate New Password
        </Button>
      </CardContent>
    </Card>
  )
}


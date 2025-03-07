'use client'

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { Copy, RefreshCw, Eye, EyeOff, Save, Key } from 'lucide-react'
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter'
import { generatePassword, calculatePasswordStrength } from '@/lib/passwordUtils'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"


interface PasswordGeneratorCardProps {
  onSave: (password: string) => void
  onCopy: (password: string) => void
  onGenerate: (password: string, strength: number) => void
}

export default function PasswordGeneratorCard({ onSave, onCopy, onGenerate }: PasswordGeneratorCardProps) {
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludedChars, setExcludedChars] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [usePronounceable, setUsePronounceable] = useState(false)
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState(0)

  const showNotification = (message: string, variant: "default" | "destructive" = "default") => {
    toast({
      description: message,
      variant: variant === "error" ? "destructive" : variant,
    })
  }

  const generateNewPassword = () => {
    const newPassword = generatePassword(
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludedChars,
      usePronounceable
    )
    setPassword(newPassword)
    const newStrength = calculatePasswordStrength(newPassword)
    setStrength(newStrength)
    onGenerate(newPassword, newStrength)
    
    showNotification("New password generated successfully", "default")
  }

  useEffect(() => {
    generateNewPassword()
    showNotification("Password settings updated, new password generated", "info")
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludedChars, usePronounceable])

  const handleCopy = () => {
    onCopy(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showNotification("Password copied to clipboard", "success")
  }

  const handleSave = () => {
    onSave(password);
    showNotification("Password saved successfully to your vault", "success");
  };

  useEffect(() => {
    showNotification("Password Generator is ready. Generate or modify your password.", "info")
  }, [])

  return (
    <Card className="w-full bg-card text-card-foreground">
      <CardContent className="space-y-6">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="pr-24 text-lg font-mono bg-background border-input focus:border-primary transition-all duration-300"
          />
          <Button
            onClick={handleCopy}
            className="absolute right-12 top-1/2 transform -translate-y-1/2"
            variant="ghost"
            size="icon"
          >
            <AnimatePresence>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-4 w-4 text-green-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          <Button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            variant="ghost"
            size="icon"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </motion.div>

        <PasswordStrengthMeter password={password} />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="length">Password Length: {length}</Label>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="[&_[role=slider]]:bg-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Toggle
              pressed={includeUppercase}
              onPressedChange={setIncludeUppercase}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              ABC
            </Toggle>
            <Toggle
              pressed={includeLowercase}
              onPressedChange={setIncludeLowercase}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              abc
            </Toggle>
            <Toggle
              pressed={includeNumbers}
              onPressedChange={setIncludeNumbers}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              123
            </Toggle>
            <Toggle
              pressed={includeSymbols}
              onPressedChange={setIncludeSymbols}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              !@#
            </Toggle>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excludedChars">Excluded Characters</Label>
            <Input
              id="excludedChars"
              value={excludedChars}
              onChange={(e) => setExcludedChars(e.target.value)}
              placeholder="e.g. !@#$"
              className="bg-background border-input text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="pronounceable"
              checked={usePronounceable}
              onCheckedChange={setUsePronounceable}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="pronounceable">Generate pronounceable password</Label>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={generateNewPassword} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors duration-300">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


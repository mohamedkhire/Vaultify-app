'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Switch } from "./ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Copy, RefreshCw, Check } from 'lucide-react'
import { generatePassword, calculatePasswordStrength } from '@/lib/password-utils'

interface PasswordGeneratorProps {
  onGenerate?: (password: string) => void
}

export function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeUppercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [strength, setStrength] = useState(0)
  const [copied, setCopied] = useState(false)
  const [generatorType, setGeneratorType] = useState<'random' | 'passphrase'>('random')
  const [words, setWords] = useState(4)
  const [separator, setSeparator] = useState('-')

  useEffect(() => {
    handleGenerate()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous, generatorType, words, separator])

  const handleGenerate = () => {
    const newPassword = generatePassword({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
      excludeAmbiguous,
      type: generatorType,
      words,
      separator,
    })
    setPassword(newPassword)
    setStrength(calculatePasswordStrength(newPassword))
    if (onGenerate) {
      onGenerate(newPassword)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={generatorType} onValueChange={(value: 'random' | 'passphrase') => setGeneratorType(value)}>
          <TabsList className="mb-4">
            <TabsTrigger value="random">Random</TabsTrigger>
            <TabsTrigger value="passphrase">Passphrase</TabsTrigger>
          </TabsList>
          <TabsContent value="random">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Password Length: {length}</Label>
                <Slider
                  min={8}
                  max={64}
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="excludeSimilar"
                    checked={excludeSimilar}
                    onCheckedChange={setExcludeSimilar}
                  />
                  <Label htmlFor="excludeSimilar">Exclude Similar Characters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="excludeAmbiguous"
                    checked={excludeAmbiguous}
                    onCheckedChange={setExcludeAmbiguous}
                  />
                  <Label htmlFor="excludeAmbiguous">Exclude Ambiguous Characters</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="passphrase">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Number of Words: {words}</Label>
                <Slider
                  min={3}
                  max={10}
                  step={1}
                  value={[words]}
                  onValueChange={(value) => setWords(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="separator">Word Separator</Label>
                <Input
                  id="separator"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  maxLength={1}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Input
              value={password}
              readOnly
              className="pr-20 font-mono text-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={copyToClipboard}
            >
              <AnimatePresence>
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Password Strength</p>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${strength}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <Button onClick={handleGenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


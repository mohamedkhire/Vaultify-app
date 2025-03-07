import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Share2, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PasswordShareModalProps {
  passwordId: string
  passwordName: string
  onShare: (id: string, expirationTime: string, message: string, oneTimeUse: boolean) => string
}

export function PasswordShareModal({ passwordId, passwordName, onShare }: PasswordShareModalProps) {
  const [expirationTime, setExpirationTime] = useState('24h')
  const [message, setMessage] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [oneTimeUse, setOneTimeUse] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const link = onShare(passwordId, expirationTime, message, oneTimeUse)
    setShareLink(link)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Password: {passwordName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiration" className="text-right">
              Expires in
            </Label>
            <Select value={expirationTime} onValueChange={setExpirationTime}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select expiration time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              placeholder="Optional message for recipient"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="one-time-use"
              checked={oneTimeUse}
              onCheckedChange={setOneTimeUse}
            />
            <Label htmlFor="one-time-use">One-time use only</Label>
          </div>
        </div>
        <Button onClick={handleShare}>Generate Share Link</Button>
        <AnimatePresence>
          {shareLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4"
            >
              <Label htmlFor="shareLink">Share Link</Label>
              <div className="flex mt-1">
                <Input
                  id="shareLink"
                  value={shareLink}
                  readOnly
                  className="flex-grow"
                />
                <Button onClick={copyToClipboard} className="ml-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}


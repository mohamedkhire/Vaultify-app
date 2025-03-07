import React from 'react'
import { Password } from '@/lib/types'
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PasswordHistoryProps {
  password: Password
}

export function PasswordHistory({ password }: PasswordHistoryProps) {
  const [showPasswords, setShowPasswords] = React.useState<{ [key: string]: boolean }>({})

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      {password.history.map((version, index) => (
        <Card key={index} className="bg-background/50 backdrop-blur-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {new Date(version.createdAt).toLocaleString()}
              </span>
              <Badge variant="outline" className="text-xs">
                {version.shared ? 'Shared' : 'Updated'}
              </Badge>
            </div>
            {version.name && <div className="text-sm">Name: {version.name}</div>}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type={showPasswords[version.createdAt.toString()] ? "text" : "password"}
                  value={version.value}
                  readOnly
                  className="w-full pr-10 font-mono text-sm bg-secondary/50 rounded-md px-3 py-2"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => togglePasswordVisibility(version.createdAt.toString())}
                >
                  {showPasswords[version.createdAt.toString()] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {version.category && (
              <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">
                {version.category}
              </Badge>
            )}
            {version.tags && version.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {version.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs px-2 py-0.5 rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


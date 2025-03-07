'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Eye, EyeOff, Trash2, Edit2, Save, Lock, Copy, History, Search, Filter, Plus } from 'lucide-react'
import { CategoryManager } from './category-manager'
import { PasswordGenerator } from './password-generator'
import { usePasswords } from '@/hooks/use-passwords'
import { Password } from '@/lib/types'
import { useToast } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'

export function PasswordVault() {
  const { passwords, addPassword, updatePassword, deletePassword } = usePasswords()
  const [newPasswordName, setNewPasswordName] = useState('')
  const [newPasswordValue, setNewPasswordValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { showToast, ToastComponent } = useToast()

  const handleAddPassword = (category: string = 'Uncategorized') => {
    if (newPasswordName && newPasswordValue) {
      addPassword({
        name: newPasswordName,
        value: newPasswordValue,
        category,
        createdAt: new Date(),
      })
      setNewPasswordName('')
      setNewPasswordValue('')
      showToast({ message: 'Password added successfully!', type: 'success' })
      logActivity('add', newPasswordName)
    }
  }

  const filteredPasswords = passwords
    .filter(pw => !selectedCategory || selectedCategory === 'All' || pw.category === selectedCategory)
    .filter(pw => 
      pw.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pw.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Lock className="w-6 h-6 mr-2 text-primary" />
            Password Vault
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPasswordName">Account Name</Label>
              <Input
                id="newPasswordName"
                value={newPasswordName}
                onChange={(e) => setNewPasswordName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newPasswordValue">Password</Label>
              <div className="flex mt-1">
                <Input
                  id="newPasswordValue"
                  type="password"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  className="flex-grow"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="ml-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate Password</DialogTitle>
                    </DialogHeader>
                    <PasswordGenerator onGenerate={(password) => setNewPasswordValue(password)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <Button onClick={() => handleAddPassword(selectedCategory || 'Uncategorized')} className="w-full">
            <Save className="mr-2 h-4 w-4" /> Add Password
          </Button>

          <CategoryManager 
            categories={Array.from(new Set(passwords.map(pw => pw.category)))}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <AnimatePresence>
            {filteredPasswords.map(pw => (
              <motion.div
                key={pw.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PasswordItem
                  password={pw}
                  onDelete={() => deletePassword(pw.id)}
                  onUpdate={(updatedPassword) => updatePassword(pw.id, updatedPassword)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <ToastComponent />
        </CardContent>
      </Card>
    </div>
  )
}

function PasswordItem({ password, onDelete, onUpdate }: { 
  password: Password, 
  onDelete: () => void, 
  onUpdate: (updatedPassword: Partial<Password>) => void 
}) {
  const { showToast, ToastComponent } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedPassword, setEditedPassword] = useState(password.value)
  const [editedCategory, setEditedCategory] = useState(password.category)
  const [editedName, setEditedName] = useState(password.name)

  const showNotification = (message: string, variant: "default" | "success" | "error" | "info" = "default") => {
    toast({
      description: message,
      variant: variant === "error" ? "destructive" : variant,
      className: "bg-background border border-border shadow-lg",
    })
  }

  const handleUpdate = () => {
    onUpdate({
      name: editedName,
      value: editedPassword,
      category: editedCategory,
    })
    setEditMode(false)
    showNotification('Password updated successfully!', 'success')
    logActivity('update', editedName)
  }

  const handleDelete = () => {
    onDelete()
    showNotification('Password deleted successfully!', 'success')
    logActivity('delete', password.name)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(password.value)
    showNotification('Password copied to clipboard', 'success')
    logActivity('copy', password.name)
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-grow space-y-2">
            {editMode ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mb-2 font-semibold"
              />
            ) : (
              <h3 className="font-semibold text-lg">{password.name}</h3>
            )}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={editMode ? editedPassword : password.value}
                onChange={(e) => setEditedPassword(e.target.value)}
                className="pr-10 font-mono"
                readOnly={!editMode}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {editMode && (
              <Input
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                placeholder="Category"
              />
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            {editMode ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleUpdate}
              >
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setEditMode(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <History className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Password History</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {/* Implement password history here */}
                  <p>Password history feature coming soon...</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ToastComponent />
      </CardContent>
    </Card>
  )
}

function logActivity(action: string, itemName: string) {
  console.log(`Activity logged: ${action} - ${itemName}`)
}


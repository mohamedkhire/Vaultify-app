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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Trash2, Edit2, Save, Vault, Copy, History, Search, Filter, Plus, KeyRound, Share2, Info } from 'lucide-react'
import { CategoryManager } from '@/components/CategoryManager'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/DashboardLayout"
import { PasswordGenerator } from '@/components/PasswordGenerator'
import { motion, AnimatePresence } from 'framer-motion'
import { usePasswords } from '@/contexts/PasswordContext'
import { Password } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter'
import { PasswordBannerGenerator } from '@/components/PasswordBannerGenerator'
import { MasterPasswordPrompt } from '@/components/MasterPasswordPrompt'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from "@/components/ui/use-toast"
import { logActivity } from '@/components/RecentActivity'
import { Badge } from "@/components/ui/badge"
import { PasswordHistory } from '@/components/PasswordHistory'

const ShowNotification = () => {
  const { toast } = useToast()
  return (message: string, variant: "default" | "success" | "error" | "info" = "default") => {
    toast({
      description: message,
      variant: variant === "error" ? "destructive" : variant,
    })
  }
}

function PasswordHistoryItem({ value }: { value: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-grow font-mono text-sm">
        {showPassword ? value : '•'.repeat(value.length)}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function PasswordVault() {
  const { passwords, addPassword, updatePassword, deletePassword, loading, lockVault } = usePasswords()
  const [newPasswordName, setNewPasswordName] = useState('')
  const [newPasswordValue, setNewPasswordValue] = useState('')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false) 
  const [isVaultLocked, setIsVaultLocked] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const showNotification = ShowNotification()

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/')
    } else {
      const uniqueCategories = new Set(passwords.map(pw => pw.category))
      const categoriesArray = Array.from(uniqueCategories)
      if (!categoriesArray.includes('All')) {
        categoriesArray.unshift('All')
      }
      setCategories(categoriesArray)
      checkVaultLockStatus()
    }
  }, [router, passwords])

  const checkVaultLockStatus = () => {
    const vaultLocked = localStorage.getItem('vaultLocked')
    setIsVaultLocked(vaultLocked !== 'false')
  }

  useEffect(() => {
    checkVaultLockStatus()
  }, [])

  useEffect(() => {
    showNotification("Password Vault loaded. Your passwords are ready to manage.", "info")
  }, [])

  const handleUnlock = () => {
    setIsVaultLocked(false)
    showNotification("Vault successfully unlocked. Welcome back!", "success")
  }

  const handleLockVault = () => {
    localStorage.setItem('vaultLocked', 'true')
    lockVault()
    setIsVaultLocked(true)
    showNotification("Your vault has been locked for security. Enter your master password to unlock.", "info")
  }

  const handleAddPassword = (category: string = 'Uncategorized') => {
    if (newPasswordName && newPasswordValue) {
      const newPassword: Omit<Password, 'id'> = {
        name: newPasswordName,
        category,
        currentVersion: {
          value: newPasswordValue,
          createdAt: new Date(),
        },
        history: [],
        tags: [],
      }
      addPassword(newPassword)
      setNewPasswordName('')
      setNewPasswordValue('')
      showNotification("New password has been added to your vault successfully", "success")
      logActivity('add', newPasswordName)
    } else {
      showNotification("Please enter both a name and a password to save", "error")
    }
  }

  const handleUpdatePassword = (id: number, newValue: string, newTags: string[], newCategory: string, newName: string) => {
    const password = passwords.find(p => p.id === id)
    if (password) {
      const updatedPassword: Partial<Password> = {
        name: newName,
        category: newCategory,
        currentVersion: {
          value: newValue,
          createdAt: new Date(),
        },
        tags: newTags,
      }
      updatePassword(id, updatedPassword)
      showNotification("Password has been updated successfully", "success")
      logActivity('update', newName)
    } else {
      showNotification("Unable to update password. Password not found.", "error")
    }
  }

  const handleDeletePassword = (id: number) => {
    const password = passwords.find(p => p.id === id)
    if (password) {
      deletePassword(id)
      showNotification("Password has been permanently deleted from your vault", "success")
      logActivity('delete', password.name)
    } else {
      showNotification("Unable to delete password. Password not found.", "error")
    }
  }

  const addCategory = (category: string) => {
    if (category !== 'All' && category !== 'Uncategorized' && !categories.includes(category)) {
      setCategories(prev => [...prev, category])
      showNotification("New category has been created successfully", "success")
    } else {
      showNotification("Unable to create category. Name is invalid or already exists.", "error")
    }
  }

  const removeCategory = (category: string) => {
    if (category !== 'All' && category !== 'Uncategorized') {
      setCategories(prev => prev.filter(c => c !== category))
      const updatedPasswords = passwords.map(pw => 
        pw.category === category ? { ...pw, category: 'Uncategorized' } : pw
      )
      updatedPasswords.forEach(pw => updatePassword(pw.id, pw))
      if (selectedCategory === category) {
        setSelectedCategory(null)
      }
      showNotification("Category removed. All associated passwords moved to Uncategorized.", "info")
    } else {
      showNotification("Cannot remove default categories", "error")
    }
  }

  const filteredPasswords = passwords
    .filter(pw => !selectedCategory || selectedCategory === 'All' || pw.category === selectedCategory)
    .filter(pw => 
      pw.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (pw.tags && pw.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) 
    )
    .sort((a, b) => b.id - a.id)  // Sort from newest to oldest
    .map((pw, index) => ({ ...pw, sequence: passwords.length - index }));

  if (loading) {
    return <div>Loading...</div>
  }

  const handleGeneratePassword = (password: string) => {
    setNewPasswordValue(password)
    showNotification("New password generated successfully", "success")
    logActivity('generate', 'New Password')
  }

  return (
    <DashboardLayout>
      <AnimatePresence>
        {isVaultLocked && (
          <MasterPasswordPrompt onUnlock={handleUnlock} />
        )}
      </AnimatePresence>
      <div className={`space-y-6 ${isVaultLocked ? 'filter blur-md' : ''}`}>
        <Card className="w-full bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Vault className="w-6 h-6 mr-2 text-primary" />
              Password Vault
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleLockVault} variant="outline">
                    Lock Vault
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lock your vault for security</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <div className="flex mt-1 relative">
                      <Input
                        id="newPasswordValue"
                        type={showNewPassword ? "text" : "password"}
                        value={newPasswordValue}
                        onChange={(e) => setNewPasswordValue(e.target.value)}
                        className="pr-20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleAddPassword(selectedCategory || 'Uncategorized')} className="flex-1">
                      <Save className="mr-2 h-4 w-4" /> Add Password
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <KeyRound className="mr-2 h-4 w-4" /> Generate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Generate Password</DialogTitle>
                        </DialogHeader>
                        <PasswordGenerator onGenerate={handleGeneratePassword} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Categories & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CategoryManager 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onAddCategory={addCategory}
                    onRemoveCategory={removeCategory}
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Filter your passwords</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </div>

            <AnimatePresence>
              {filteredPasswords.map((pw) => (
                <motion.div
                  key={pw.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <PasswordItem
                    password={pw}
                    onDelete={() => handleDeletePassword(pw.id)}
                    onUpdate={(newValue, newTags, newCategory, newName) => handleUpdatePassword(pw.id, newValue, newTags, newCategory, newName)}
                    categories={categories}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

const IconButton = ({ icon: Icon, onClick, label }: { icon: LucideIcon, onClick: () => void, label: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          aria-label={label}
          className="hover:bg-secondary/50 transition-colors duration-200"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

function PasswordItem({ password, onDelete, onUpdate, categories }: { 
  password: Password, 
  onDelete: () => void, 
  onUpdate: (newValue: string, newTags: string[], newCategory: string, newName: string) => void,
  categories: string[],
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedPassword, setEditedPassword] = useState(password.currentVersion.value)
  const [editedTags, setEditedTags] = useState(password.tags ? password.tags.join(', ') : '')
  const [editedCategory, setEditedCategory] = useState(password.category)
  const [editedName, setEditedName] = useState(password.name)
  const { updatePasswordHistory } = usePasswords()
  const showNotification = ShowNotification()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password.currentVersion.value)
    updatePasswordHistory(password.id, { ...password.currentVersion, createdAt: new Date() })
    showNotification("Password has been copied to your clipboard", "success")
  }

  const handleUpdate = () => {
    onUpdate(editedPassword, editedTags.split(',').map(tag => tag.trim()), editedCategory, editedName)
    setEditMode(false)
    showNotification(`Password for "${editedName}" has been updated`, "success")
    updatePasswordHistory(password.id, { 
      value: editedPassword, 
      createdAt: new Date(),
      name: editedName,
      category: editedCategory,
      tags: editedTags.split(',').map(tag => tag.trim())
    })
  }

  const handleShare = () => {
    showNotification("Share link generated successfully. The link will expire in 24 hours.", "success")
    updatePasswordHistory(password.id, { 
      ...password.currentVersion,
      createdAt: new Date(),
      shared: true
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 bg-background/50 backdrop-blur-sm border border-primary/10">
      <CardContent className="p-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              {editMode ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-lg font-semibold"
                  aria-label={`Edit name for ${password.name}`}
                />
              ) : (
                <h3 className="text-lg font-semibold truncate" id={`password-name-${password.id}`}>
                  {password.name}
                </h3>
              )}
            </div>
            <div className="flex space-x-1">
              <IconButton icon={Copy} onClick={copyToClipboard} label="Copy password" />
              <IconButton icon={editMode ? Save : Edit2} onClick={editMode ? handleUpdate : () => setEditMode(true)} label={editMode ? "Save changes" : "Edit password"} />
              <IconButton icon={Trash2} onClick={onDelete} label="Delete password" />
              <Dialog>
                <DialogTrigger asChild>
                  <IconButton icon={History} label="View password history" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Password History</DialogTitle>
                  </DialogHeader>
                  <PasswordHistory password={password} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <IconButton icon={Share2} onClick={handleShare} label="Share password" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Password</DialogTitle>
                  </DialogHeader>
                  <PasswordBannerGenerator passwordName={password.name} passwordValue={password.currentVersion.value} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={editMode ? editedPassword : password.currentVersion.value}
                onChange={(e) => setEditedPassword(e.target.value)}
                className="pr-10 font-mono text-sm bg-secondary/50"
                readOnly={!editMode}
                aria-label={`Password for ${password.name}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {editMode ? (
              <Select value={editedCategory} onValueChange={(value) => setEditedCategory(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat, index) => (
                    <SelectItem key={`${cat}-${index}`} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">
                {password.category}
              </Badge>
            )}
          </div>
          {editMode && (
            <Input
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              className="mt-1 text-sm"
              placeholder="Tags (comma-separated)"
              aria-label="Edit tags"
            />
          )}
          
        </motion.div>
      </CardContent>
    </Card>
  )
}


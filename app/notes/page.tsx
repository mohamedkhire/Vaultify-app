/*
 * Project: Vaultify App
 * Author: Mohamed Khire
 * Date: Mar 2025
 * Description: Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://vaultifyapp.vercel.app/
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import { Lock, Save, Trash2, Eye, EyeOff, Edit2, Shield } from 'lucide-react'
import { DashboardLayout } from "@/components/DashboardLayout"
import { AnimatedTransition } from '@/components/animated-transition'
import { MasterPasswordPrompt } from '@/components/MasterPasswordPrompt'
import { AnimatePresence, motion } from 'framer-motion'

interface EncryptedNote {
  id: number;
  title: string;
  content: string;
}

export default function EncryptedNotes() {
  const [notes, setNotes] = useState<EncryptedNote[]>([])
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const contentEditableRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [isVaultLocked, setIsVaultLocked] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('currentUser')) {
        router.push('/')
      } else {
        checkVaultLockStatus()
        if (!isVaultLocked) {
          loadNotes()
        }
      }
    }
  }, [router, isVaultLocked])

  const checkVaultLockStatus = () => {
    const vaultLocked = localStorage.getItem('vaultLocked')
    setIsVaultLocked(vaultLocked !== 'false')
  }

  const loadNotes = () => {
    const currentUser = localStorage.getItem('currentUser') || 'default'
    const storedNotes = JSON.parse(localStorage.getItem(`${currentUser}_encryptedNotes`) || '[]')
    setNotes(storedNotes)
  }

  const handleUnlock = () => {
    setIsVaultLocked(false)
  }

  const handleLockVault = () => {
    localStorage.setItem('vaultLocked', 'true')
    setIsVaultLocked(true)
    setNotes([])
    toast({ description: 'Vault locked successfully!', type: 'success' })
  }

  useEffect(() => {
    const handleTabChange = () => {
      setActiveNoteId(null)
    }

    window.addEventListener('blur', handleTabChange)
    window.addEventListener('focus', handleTabChange)

    return () => {
      window.removeEventListener('blur', handleTabChange)
      window.removeEventListener('focus', handleTabChange)
    }
  }, [])

  const addNote = () => {
    if (newNoteTitle && newNoteContent) {
      const newNote: EncryptedNote = {
        id: Date.now(),
        title: newNoteTitle,
        content: newNoteContent,
      }
      const updatedNotes = [...notes, newNote]
      setNotes(updatedNotes)
      const currentUser = localStorage.getItem('currentUser') || 'default'
      localStorage.setItem(`${currentUser}_encryptedNotes`, JSON.stringify(updatedNotes))
      setNewNoteTitle('')
      setNewNoteContent('')
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = ''
      }
      toast({ description: 'Note added successfully!', type: 'success' })
    }
  }

  const updateNote = (id: number, updatedTitle: string, updatedContent: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, title: updatedTitle, content: updatedContent } : note
    )
    setNotes(updatedNotes)
    const currentUser = localStorage.getItem('currentUser') || 'default'
    localStorage.setItem(`${currentUser}_encryptedNotes`, JSON.stringify(updatedNotes))
    setEditingNoteId(null)
    toast({ description: 'Note updated successfully!', type: 'success' })
  }

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    const currentUser = localStorage.getItem('currentUser') || 'default'
    localStorage.setItem(`${currentUser}_encryptedNotes`, JSON.stringify(updatedNotes))
    toast({ description: 'Note deleted successfully!', type: 'success' })
  }

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      setNewNoteContent(contentEditableRef.current.innerHTML)
    }
  }

  const toggleNoteVisibility = (id: number) => {
    setActiveNoteId(activeNoteId === id ? null : id)
  }

  return (
    <DashboardLayout>
      <AnimatedTransition>
        <div className="relative min-h-[calc(100vh-4rem)]">
          <AnimatePresence>
            {isVaultLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              >
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center justify-center">
                      <Shield className="w-6 h-6 mr-2 text-primary" />
                      Unlock Your Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MasterPasswordPrompt onUnlock={handleUnlock} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={`space-y-6 transition-all duration-300 ${isVaultLocked ? 'filter blur-md' : ''}`}>
            <Card className="w-full bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="w-6 h-6 mr-2 text-primary" />
                    Encrypted Notes
                  </div>
                  <Button onClick={handleLockVault} variant="outline">
                    Lock Notes
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Note Title"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                  />
                  <div
                    ref={contentEditableRef}
                    contentEditable
                    onInput={handleContentChange}
                    className="min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Note content"
                    role="textbox"
                  />
                  <Button onClick={addNote} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </Button>
                </div>

                <div className="space-y-4">
                  {[...notes].sort((a, b) => b.id - a.id).map(note => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <h3 className="font-semibold">{note.title}</h3>
                            {editingNoteId === note.id ? (
                              <div className="mt-2 space-y-2">
                                <Input
                                  value={note.title}
                                  onChange={(e) => {
                                    const updatedNotes = notes.map(n =>
                                      n.id === note.id ? { ...n, title: e.target.value } : n
                                    )
                                    setNotes(updatedNotes)
                                  }}
                                  placeholder="Note Title"
                                />
                                <div
                                  contentEditable
                                  onInput={(e) => {
                                    const updatedNotes = notes.map(n =>
                                      n.id === note.id ? { ...n, content: e.currentTarget.innerHTML } : n
                                    )
                                    setNotes(updatedNotes)
                                  }}
                                  className="min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                  dangerouslySetInnerHTML={{ __html: note.content }}
                                />
                                <Button onClick={() => updateNote(note.id, note.title, note.content)}>
                                  Save Changes
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="text-sm text-muted-foreground mt-1" 
                                dangerouslySetInnerHTML={{ 
                                  __html: activeNoteId === note.id ? note.content : '•'.repeat(note.content.length) 
                                }}
                              />
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleNoteVisibility(note.id)}
                              aria-label={activeNoteId === note.id ? "Hide note content" : "Show note content"}
                            >
                              {activeNoteId === note.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setEditingNoteId(editingNoteId === note.id ? null : note.id)}
                              aria-label={editingNoteId === note.id ? "Cancel editing" : "Edit note"}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteNote(note.id)}
                              aria-label={`Delete note: ${note.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedTransition>
    </DashboardLayout>
  )
}


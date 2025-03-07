'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Password, PasswordVersion } from '@/lib/types'
import { encryptPassword, decryptPassword } from '@/lib/encryption'
import { verifyToken } from '@/lib/auth'

type PasswordWithSequence = Password & { sequence?: number };

interface PasswordContextType {
  passwords: PasswordWithSequence[];
  addPassword: (password: Omit<PasswordWithSequence, 'id'>) => void;
  updatePassword: (id: number, updatedPassword: Partial<Omit<PasswordWithSequence, 'id'>>) => void;
  deletePassword: (id: number) => void;
  updatePasswordHistory: (id: number, newVersion: PasswordVersion) => void;
  loading: boolean;
  lockVault: () => void;
  findReusedPasswords: () => Password[];
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined)

export const usePasswords = () => {
  const context = useContext(PasswordContext)
  if (!context) {
    throw new Error('usePasswords must be used within a PasswordProvider')
  }
  return context
}

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passwords, setPasswords] = useState<PasswordWithSequence[]>([])
  const [loading, setLoading] = useState(true)

  const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentUser') || 'default'
    }
    return 'default'
  }

  const getStorageKey = (key: string) => {
    const currentUser = getCurrentUser()
    return `${currentUser}_${key}`
  }

  const loadPasswords = async () => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('authToken')
    const currentUser = localStorage.getItem('currentUser')
    if (!token || !currentUser || !verifyToken(token)) {
      setPasswords([])
      setLoading(false)
      return
    }
    setPasswords([]) // Clear existing passwords
    const storedPasswords = localStorage.getItem(getStorageKey('passwords'))
    if (storedPasswords) {
      const decryptedPasswords = JSON.parse(storedPasswords).map((pw: Password) => ({
        ...pw,
        currentVersion: pw.currentVersion ? {
          ...pw.currentVersion,
          value: pw.currentVersion.value ? decryptPassword(pw.currentVersion.value) : ''
        } : { value: '', createdAt: new Date() },
        history: pw.history ? pw.history.map((version: PasswordVersion) => ({
          ...version,
          value: version.value ? decryptPassword(version.value) : ''
        })) : []
      }))
      setPasswords(decryptedPasswords)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadPasswords()
  }, [])

  useEffect(() => {
    const savePasswords = async () => {
      if (typeof window === 'undefined') return

      const encryptedPasswords = passwords.map(pw => ({
        ...pw,
        currentVersion: pw.currentVersion ? {
          ...pw.currentVersion,
          value: pw.currentVersion.value ? encryptPassword(pw.currentVersion.value) : ''
        } : { value: '', createdAt: new Date() },
        history: pw.history ? pw.history.map((version: PasswordVersion) => ({
          ...version,
          value: version.value ? encryptPassword(version.value) : ''
        })) : []
      }))
      localStorage.setItem(getStorageKey('passwords'), JSON.stringify(encryptedPasswords))
    }
    if (!loading) {
      savePasswords()
    }
  }, [passwords, loading])

  const addPassword = (password: Omit<PasswordWithSequence, 'id'>) => {
    const newPassword = { ...password, id: Date.now() };
    setPasswords(prev => {
      const updatedPasswords = [...prev, newPassword];
      return updatedPasswords.sort((a, b) => b.id - a.id).map((pw, index) => ({ ...pw, sequence: updatedPasswords.length - index }));
    });
  }

  const updatePassword = (id: number, updatedPassword: Partial<Omit<PasswordWithSequence, 'id'>>) => {
    setPasswords(prev => {
      const updatedPasswords = prev.map(pw => {
        if (pw.id === id) {
          const newPassword = { ...pw, ...updatedPassword };
          if (updatedPassword.currentVersion && updatedPassword.currentVersion.value !== pw.currentVersion.value) {
            newPassword.history = [pw.currentVersion, ...pw.history].slice(0, 10); // Keep last 10 versions
          }
          return newPassword;
        }
        return pw;
      });
      return updatedPasswords.sort((a, b) => b.id - a.id).map((pw, index) => ({ ...pw, sequence: updatedPasswords.length - index }));
    });
  };

  const updatePasswordHistory = (id: number, newVersion: PasswordVersion) => {
    setPasswords(prev => prev.map(pw => {
      if (pw.id === id) {
        return {
          ...pw,
          currentVersion: newVersion,
          history: [pw.currentVersion, ...pw.history].slice(0, 10) // Keep last 10 versions
        }
      }
      return pw
    }))
  }

  const deletePassword = (id: number) => {
    setPasswords(prev => {
      const updatedPasswords = prev.filter(pw => pw.id !== id);
      return updatedPasswords.sort((a, b) => b.id - a.id).map((pw, index) => ({ ...pw, sequence: updatedPasswords.length - index }));
    });
  }

  const lockVault = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vaultLocked', 'true')
    }
  }

  const findReusedPasswords = () => {
    const passwordMap = new Map<string, Password[]>();
    passwords.forEach(pw => {
      const value = pw.currentVersion?.value || '';
      const existing = passwordMap.get(value) || [];
      passwordMap.set(value, [...existing, pw]);
    });
    return Array.from(passwordMap.values()).filter(group => group.length > 1).flat();
  };

  return (
    <PasswordContext.Provider value={{ 
      passwords, 
      addPassword, 
      updatePassword, 
      deletePassword, 
      updatePasswordHistory,
      loading, 
      lockVault,
      findReusedPasswords
    }}>
      {children}
    </PasswordContext.Provider>
  )
}


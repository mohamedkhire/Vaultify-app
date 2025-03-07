import { Password } from '@/lib/types'
import { encryptPassword, decryptPassword } from '@/lib/encryption'

export function addPassword(password: Password) {
  const existingPasswords = getPasswords()
  const updatedPasswords = [...existingPasswords, {
    ...password,
    currentVersion: {
      ...password.currentVersion,
      value: encryptPassword(password.currentVersion.value)
    }
  }]
  localStorage.setItem('passwords', JSON.stringify(updatedPasswords))
}

export function getPasswords(): Password[] {
  const passwords = JSON.parse(localStorage.getItem('passwords') || '[]')
  return passwords.map((pw: Password) => ({
    ...pw,
    currentVersion: {
      ...pw.currentVersion,
      value: decryptPassword(pw.currentVersion.value)
    }
  }))
}

export function updatePassword(id: number, updatedPassword: Partial<Password>) {
  const passwords = getPasswords()
  const updatedPasswords = passwords.map(pw => 
    pw.id === id 
      ? { 
          ...pw, 
          ...updatedPassword, 
          currentVersion: {
            ...pw.currentVersion,
            ...updatedPassword.currentVersion,
            value: updatedPassword.currentVersion?.value 
              ? encryptPassword(updatedPassword.currentVersion.value)
              : pw.currentVersion.value
          }
        }
      : pw
  )
  localStorage.setItem('passwords', JSON.stringify(updatedPasswords))
}

export function deletePassword(id: number) {
  const passwords = getPasswords()
  const updatedPasswords = passwords.filter(pw => pw.id !== id)
  localStorage.setItem('passwords', JSON.stringify(updatedPasswords))
}

export function updatePasswordHistory(id: number, newVersion: Password['currentVersion']) {
  const passwords = getPasswords()
  const updatedPasswords = passwords.map(pw => {
    if (pw.id === id) {
      const updatedHistory = [pw.currentVersion, ...pw.history].slice(0, 10) // Keep last 10 versions
      return {
        ...pw,
        currentVersion: {
          ...newVersion,
          value: encryptPassword(newVersion.value)
        },
        history: updatedHistory
      }
    }
    return pw
  })
  localStorage.setItem('passwords', JSON.stringify(updatedPasswords))
}

export function searchPasswords(query: string): Password[] {
  const passwords = getPasswords()
  return passwords.filter(pw => 
    pw.name.toLowerCase().includes(query.toLowerCase()) ||
    pw.category.toLowerCase().includes(query.toLowerCase()) ||
    (pw.tags && pw.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
  )
}

// Remove or comment out this function
// export function getPasswordStrength(password: string): number {
//   // Implement password strength calculation logic here
//   // This is a simple example and should be replaced with a more robust algorithm
//   let strength = 0
//   if (password.length >= 8) strength += 25
//   if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25
//   if (password.match(/\d/)) strength += 25
//   if (password.match(/[^a-zA-Z\d]/)) strength += 25
//   return strength
// }

export function generatePassword(length: number = 16, options: { 
  includeUppercase?: boolean, 
  includeLowercase?: boolean, 
  includeNumbers?: boolean, 
  includeSymbols?: boolean 
} = {}): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let chars = ''
  if (options.includeUppercase !== false) chars += uppercase
  if (options.includeLowercase !== false) chars += lowercase
  if (options.includeNumbers !== false) chars += numbers
  if (options.includeSymbols === true) chars += symbols

  if (chars === '') chars = lowercase + numbers // Fallback to ensure some characters are available

  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return password
}

export function calculatePasswordStrength(password: string): number {
  let score = 0;

  // Length
  if (password.length > 8) score += 10;
  if (password.length > 12) score += 10;
  if (password.length > 16) score += 10;

  // Lowercase letters
  if (password.match(/[a-z]/)) score += 10;

  // Uppercase letters
  if (password.match(/[A-Z]/)) score += 10;

  // Numbers
  if (password.match(/\d/)) score += 10;

  // Special characters
  if (password.match(/[^A-Za-z0-9]/)) score += 10;

  // Bonus for mixing characters
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) score += 10;
  if (password.match(/([a-zA-Z]).*(\d)|(\d).*([a-zA-Z])/)) score += 10;
  if (password.match(/([a-zA-Z0-9]).*([^A-Za-z0-9])|([^A-Za-z0-9]).*([a-zA-Z0-9])/)) score += 10;

  // Penalize repeated characters
  if (password.match(/(.*[^\w\d\s])\1/)) score -= 10;

  return Math.min(100, Math.max(0, score));
}

export function getStrengthLabel(strength: number): string {
  if (strength < 20) return 'Very Weak';
  if (strength < 40) return 'Weak';
  if (strength < 60) return 'Moderate';
  if (strength < 80) return 'Strong';
  return 'Very Strong';
}

export function getStrengthColor(strength: number): string {
  if (strength < 20) return 'bg-red-500';
  if (strength < 40) return 'bg-orange-500';
  if (strength < 60) return 'bg-yellow-500';
  if (strength < 80) return 'bg-green-500';
  return 'bg-blue-500';
}

export function getPasswordSuggestions(password: string): string[] {
  const suggestions: string[] = [];

  if (password.length < 12) {
    suggestions.push('Make the password at least 12 characters long');
  }

  if (!password.match(/[A-Z]/)) {
    suggestions.push('Include at least one uppercase letter');
  }

  if (!password.match(/[a-z]/)) {
    suggestions.push('Include at least one lowercase letter');
  }

  if (!password.match(/\d/)) {
    suggestions.push('Include at least one number');
  }

  if (!password.match(/[^A-Za-z0-9]/)) {
    suggestions.push('Include at least one special character');
  }

  if (password.match(/(.)\1{2,}/)) {
    suggestions.push('Avoid repeating characters more than twice in a row');
  }

  if (suggestions.length === 0) {
    suggestions.push('Your password is strong! Remember to use unique passwords for different accounts.');
  }

  return suggestions;
}


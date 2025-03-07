import CryptoJS from 'crypto-js'

const SECRET_KEY = typeof window !== 'undefined' ? (window as any).ENV_ENCRYPTION_KEY || 'default-secret-key' : 'default-secret-key'

export function encryptPassword(password: string): string {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString()
}

export function decryptPassword(encryptedPassword: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}


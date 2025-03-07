import bcrypt from 'bcryptjs'

// This is a simple in-memory storage for demonstration purposes.
// In a real application, you would use a database and proper encryption.
const users: { [key: string]: { password: string, email: string } } = {}

export function createUser(username: string, password: string, email: string): void {
  const hashedPassword = bcrypt.hashSync(password, 10)
  users[username] = { password: hashedPassword, email }
}

export function checkUserExists(username: string): boolean {
  return username in users
}

export function verifyUser(username: string, password: string): boolean {
  const user = users[username]
  return user && bcrypt.compareSync(password, user.password)
}

export function generateToken(username: string): string {
  return btoa(username + ':' + Date.now());
}

export function verifyToken(token: string): { username: string } | null {
  try {
    const [username, timestamp] = atob(token).split(':');
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge < 3600000) { // 1 hour expiration
      return { username };
    }
    return null;
  } catch (error) {
    return null;
  }
}


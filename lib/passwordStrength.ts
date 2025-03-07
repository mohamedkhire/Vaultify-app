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


import { Password } from './types'
import { calculatePasswordStrength } from './passwordUtils'

export interface SecurityCheckResult {
  overallScore: number;
  weakPasswords: Password[];
  reusedPasswords: Password[];
  oldPasswords: Password[];
}

export function performSecurityCheck(passwords: Password[]): SecurityCheckResult {
  const weakPasswords = passwords.filter(pw => calculatePasswordStrength(pw.currentVersion.value) < 60);
  const reusedPasswords = findReusedPasswords(passwords);
  const oldPasswords = findOldPasswords(passwords);

  const overallScore = calculateOverallScore(passwords, weakPasswords, reusedPasswords, oldPasswords);

  return {
    overallScore,
    weakPasswords,
    reusedPasswords,
    oldPasswords,
  };
}

function findReusedPasswords(passwords: Password[]): Password[] {
  const passwordMap = new Map<string, Password[]>();
  passwords.forEach(pw => {
    const existing = passwordMap.get(pw.currentVersion.value) || [];
    passwordMap.set(pw.currentVersion.value, [...existing, pw]);
  });
  return Array.from(passwordMap.values()).filter(group => group.length > 1).flat();
}

function findOldPasswords(passwords: Password[]): Password[] {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return passwords.filter(pw => new Date(pw.currentVersion.createdAt) < sixMonthsAgo);
}

function calculateOverallScore(
  passwords: Password[],
  weakPasswords: Password[],
  reusedPasswords: Password[],
  oldPasswords: Password[]
): number {
  if (passwords.length === 0) return 100;

  const weakPasswordsPercentage = (weakPasswords.length / passwords.length) * 100;
  const reusedPasswordsPercentage = (reusedPasswords.length / passwords.length) * 100;
  const oldPasswordsPercentage = (oldPasswords.length / passwords.length) * 100;

  const averageStrength = passwords.reduce((sum, pw) => sum + calculatePasswordStrength(pw.currentVersion.value), 0) / passwords.length;

  const score = 100 - (
    (weakPasswordsPercentage * 0.4) +
    (reusedPasswordsPercentage * 0.4) +
    (oldPasswordsPercentage * 0.2)
  );

  return Math.round((score + averageStrength) / 2);
}


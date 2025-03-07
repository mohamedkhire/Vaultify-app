import { motion } from 'framer-motion'
import { calculatePasswordStrength, getStrengthLabel, getStrengthColor } from '@/lib/passwordUtils'
import { Card, CardContent } from "@/components/ui/card"

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password)
  const label = getStrengthLabel(strength)
  const color = getStrengthColor(strength)

  return (
    <Card className="w-full bg-card text-card-foreground">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Password Strength:</span>
          <span className="font-semibold text-foreground">{label}</span>
        </div>
        <div className="relative h-4 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className={`absolute top-0 left-0 h-full ${color} transition-all duration-300 ease-in-out`}
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full w-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`absolute top-0 bottom-0 w-px bg-background ${
                  index === 0 ? 'left-1/5' : index === 1 ? 'left-2/5' : index === 2 ? 'left-3/5' : index === 3 ? 'left-4/5' : ''
                }`}
              />
            ))}
          </motion.div>
        </div>
        <motion.p
          className="text-sm text-muted-foreground mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {strength < 75 ? 'Try adding more variety to your password.' : 'Great password! Keep it safe.'}
        </motion.p>
      </CardContent>
    </Card>
  )
}


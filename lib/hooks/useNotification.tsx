"use client"

import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function useNotification() {
  const { toast } = useToast()

  const showNotification = (message: string, variant: "default" | "success" | "error" | "info" = "default") => {
    toast({
      description: (
        <div className="flex items-center space-x-2">
          {variant === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {variant === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {variant === "info" && <Info className="h-5 w-5 text-blue-500" />}
          <span>{message}</span>
        </div>
      ),
      variant: variant === "error" ? "destructive" : variant,
      className: "bg-background border border-border",
    })
  }

  return {
    showSuccess: (message: string) => showNotification(message, "success"),
    showError: (message: string) => showNotification(message, "error"),
    showInfo: (message: string) => showNotification(message, "info"),
  }
}


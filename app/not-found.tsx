/*
 * Project: Vaultify App
 * Author: Mohamed Khire
 * Date: Mar 2025
 * Description: Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://vaultifyapp.vercel.app/
 */
export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="flex items-center gap-6">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <div className="h-12 w-px bg-border" />
        <p className="text-lg text-foreground">This page could not be found.</p>
      </div>
    </div>
  )
}


/*
 * Project: Vaultify App
 * Author: Mohamed Khire
 * Date: Mar 2025
 * Description: Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://vaultifyapp.vercel.app/
 */
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { PasswordProvider } from "@/contexts/PasswordContext"
import { Navbar } from "@/components/Navbar"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <title>Vaultify - Password & Notes Manager</title>
        <meta name="title" content="Vaultify - Password & Notes Manager" />
        <meta name="description" content="Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vaultifyapp.vercel.app/" />
        <meta property="og:title" content="Vaultify - Password & Notes Manager" />
        <meta property="og:description" content="Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts." />
        <meta property="og:image" content="https://i.ibb.co/wn4rcJ0/vaultify.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vaultifyapp.vercel.app/" />
        <meta property="twitter:title" content="Vaultify - Password & Notes Manager" />
        <meta property="twitter:description" content="Vaultify - Generate strong passwords, store them securely in a password vault, keep encrypted notes, check password strength, and visualize data with charts." />
        <meta property="twitter:image" content="https://i.ibb.co/wn4rcJ0/vaultify.png" />
        <meta name="author" content="Mohamed Khire" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/password.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PasswordProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
            </div>
            <Toaster />
          </PasswordProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };

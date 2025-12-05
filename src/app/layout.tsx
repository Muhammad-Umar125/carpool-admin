import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carpool Admin Portal',
  description: 'Internal admin portal for carpool application management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Header shown on ALL pages including login */}
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-semibold">Carpool Admin Portal</h1>
        </header>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  )
}
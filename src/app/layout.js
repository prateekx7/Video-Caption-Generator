import './globals.css'
import SparklesIcon from "@/components/SparklesIcon";
import { Inter } from 'next/font/google'
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Content Captions',
  description: 'Created by Prateek Sharma',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gradient-to-b from-slate-900 to-slate-500 min-h-screen text-white"}>
        <main className="p-4 max-w-2xl mx-auto">
          <header className="flex justify-between my-2 sm:my-8">
            <Link href="/" className="flex gap-1">
              <SparklesIcon />
              <span>Content Captions</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-6 text-white/80 text-sm sm:text-bas">
              <Link href="/">Home</Link>
              <Link href="/pricing">Pricing</Link>
              <a href="mailto:sharmaprateek0076@gmail.com">Contact</a>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  )
}
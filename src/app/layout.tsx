import './globals.css'
import { LanguageProvider } from './context/LanguageContext'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { DirProvider } from './context/DirContext'

export const metadata = {
  title: 'Basketball Scorer',
  description: 'Teams and Scores - Record your basketball games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-zinc-900'>
        <LanguageProvider>
          <DirProvider>
            <main className="pb-16">{children}</main>
            <Analytics />
            <Footer />
          </DirProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

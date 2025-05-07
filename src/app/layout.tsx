import './globals.css'
import { LanguageProvider } from './context/LanguageContext'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { DirProvider } from './context/DirContext'

export const metadata = {
  title: 'Basketball Scorer',
  description: 'Teams and Scores - Record your basketball games',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Basketball Scorer',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
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

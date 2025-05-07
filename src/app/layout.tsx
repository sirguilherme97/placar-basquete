import './globals.css'
import { LanguageProvider } from './context/LanguageContext'
import Footer from './components/Footer'

export const metadata = {
  title: 'Basquete Morrinhos',
  description: 'Timer e Placar - Jogo de Basquete em Morrinhos do Sul',
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
          <main className="pb-16">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}

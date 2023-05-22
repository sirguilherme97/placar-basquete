import './globals.css'

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
      <body className='bg-zinc-900'>{children}</body>
    </html>
  )
}

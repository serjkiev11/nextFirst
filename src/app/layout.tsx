import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/layout/header'
import { Providers } from '@/providers/provider'
import { siteConfig } from '@/config/site.config'
import { layoutConfig } from '@/config/layout.config'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth/auth'
import { AuthProvider } from '@/providers/auth-provider'
import Title from '@/components/ui/layout/title'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SessionProvider
            session={session}
            refetchInterval={0}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
          >
            <AuthProvider>
              <div className='flex min-h-screen flex-col justify-between'>
                <div className='flex flex-col'>
                  <Header />
                  <main className='flex flex-col max-w-[1024px] mx-auto justify-start items-center'>
                    <Title />
                    {children}
                  </main>
                </div>
                <footer
                  className={`flex flex-col justify-center items-center`}
                  style={{
                    height: `${layoutConfig.footerHeight}`,
                  }}
                >
                  <p>{siteConfig.description}</p>
                </footer>
              </div>
            </AuthProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}

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
            <Header />
            <Title />
            <main
              className='flex flex-col w-full justify-start items-center'
              style={{
                height: `calc(100vh - ${layoutConfig.headerHeight} - ${layoutConfig.footerHeight})`,
              }}
            >
              {children}
            </main>
            <footer
              className={`flex justify-center items-center`}
              style={{
                height: `${layoutConfig.footerHeight}`,
              }}
            >
              <p>{siteConfig.description}</p>
            </footer>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}

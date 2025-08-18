'use client'

import { layoutConfig } from '@/config/layout.config'
import { siteConfig } from '@/config/site.config'
import RegistrationForm from '@/forms/registration.form'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import RegistrationModal from '../modals/registration.modal'
import LoginModal from '../modals/login.modal'
import { HeaderButton } from '../header-button'
import { useState } from 'react'
import { signOutFunc } from '@/actions/sign-out'
import { useSession } from 'next-auth/react'

export const Logo = () => {
  return (
    <Image
      alt={siteConfig.title}
      src='/logo.png'
      width={40}
      height={40}
      style={{
        width: 'auto',
        height: 'auto',
      }}
      priority
    />
  )
}

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  console.log(
    '🔍 Header session:',
    session ? 'Found' : 'Not found',
    session?.user?.email,
    'Status:',
    status
  )

  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      console.log('🚪 Starting sign out from header...')

      // Вызываем server action для выхода
      await signOutFunc()

      // После успешного выхода принудительно обновляем страницу
      window.location.href = '/'
    } catch (error) {
      console.log('❌ Sign out error in header:', error)
      setIsSigningOut(false)
      // В случае ошибки тоже обновляем страницу
      window.location.href = '/'
    }
  }
  const getNavItems = () => {
    return siteConfig.navItems.map((item) => {
      const isActive = pathname === item.href

      return (
        <NavbarItem key={item.href}>
          <Link
            color={'foreground'}
            href={item.href}
            className={`px-3 py-1 border border-transparent rounded-md
                  ${isActive ? 'text-blue-500' : 'text-foreground'}
                  hover:text-blue-500 hover:border-blue-500
                  transition-all duration-100
                  `}
          >
            {item.label}
          </Link>
        </NavbarItem>
      )
    })
  }

  return (
    <Navbar
      style={{
        height: `${layoutConfig.headerHeight}`,
      }}
    >
      <NavbarBrand>
        <Link
          href='/'
          className='flex items-center gap-2'
        >
          <Logo />
          <p className='font-bold text-inherit'>{siteConfig.title}</p>
        </Link>
      </NavbarBrand>

      <NavbarContent
        className='hidden sm:flex gap-4'
        justify='center'
      >
        {getNavItems()}
      </NavbarContent>

      <NavbarContent justify='end'>
        {session ? (
          // Показываем если пользователь авторизован
          <>
            <NavbarItem className='hidden lg:flex'>
              <span className='text-sm'>Привет, {session.user?.email}</span>
            </NavbarItem>
            <NavbarItem>
              <HeaderButton
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Выходим...' : 'Выйти'}
              </HeaderButton>
            </NavbarItem>
          </>
        ) : (
          // Показываем если пользователь НЕ авторизован
          <>
            <NavbarItem className='hidden lg:flex'>
              <HeaderButton onClick={() => setIsLoginOpen(true)}>
                Логин
              </HeaderButton>
            </NavbarItem>
            <NavbarItem>
              <HeaderButton onClick={() => setIsRegistrationOpen(true)}>
                Регистрация
              </HeaderButton>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </Navbar>
  )
}

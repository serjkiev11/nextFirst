'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession()
  const setAuthState = useAuthStore((state) => state.setAuthState)

  useEffect(() => {
    // Синхронизируем NextAuth с Zustand store
    if (status === 'loading') {
      setAuthState('loading', null)
    } else if (status === 'authenticated' && session) {
      setAuthState('authentificated', session)
    } else {
      setAuthState('unauthentificated', null)
    }
  }, [status, session, setAuthState])

  return <>{children}</>
}

'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession()
  const setAuthState = useAuthStore((state) => state.setAuthState)
  const previousStatus = useRef(status)
  const previousSessionId = useRef(session?.user?.email)

  useEffect(() => {
    // Синхронизируем только если действительно изменилось состояние
    const statusChanged = previousStatus.current !== status
    const sessionChanged = previousSessionId.current !== session?.user?.email

    if (statusChanged || sessionChanged) {
      if (status === 'loading') {
        setAuthState('loading', null)
      } else if (status === 'authenticated' && session) {
        setAuthState('authenticated', session)
      } else {
        setAuthState('unauthenticated', null)
      }

      previousStatus.current = status
      previousSessionId.current = session?.user?.email
    }
  }, [status, session, setAuthState])

  return <>{children}</>
}

import { Session } from 'next-auth'
import { create } from 'zustand'

type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

interface AuthState {
  isAuth: boolean
  status: SessionStatus
  session: Session | null
  setAuthState: (status: SessionStatus, session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: true, // Устанавливаем как авторизованного для разработки
  status: 'authenticated',
  session: {
    user: {
      id: 'dev-user',
      email: 'dev@example.com',
    },
  } as Session,
  setAuthState: (status: SessionStatus, session: Session | null) =>
    set({
      isAuth: status === 'authenticated',
      status,
      session,
    }),
}))

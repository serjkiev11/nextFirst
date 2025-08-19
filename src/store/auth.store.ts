import { Session } from 'next-auth'
import { create } from 'zustand'

type SessionStatus = 'authentificated' | 'unauthentificated' | 'loading'

interface AuthState {
  isAuth: boolean
  status: SessionStatus
  session: Session | null
  setAuthState: (status: SessionStatus, session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  status: 'unauthentificated',
  session: null,
  setAuthState: (status: SessionStatus, session: Session | null) =>
    set({
      isAuth: status === 'authentificated',
      status,
      session,
    }),
}))

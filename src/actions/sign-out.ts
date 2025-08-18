'use server'

import { signOut } from '@/auth/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOutFunc() {
  try {
    // Сначала вызываем NextAuth signOut
    await signOut({
      redirect: false,
    })

    // Принудительно очищаем все связанные cookies
    const cookieStore = await cookies()

    // Очищаем основные NextAuth cookies
    cookieStore.delete('authjs.session-token')
    cookieStore.delete('authjs.callback-url')
    cookieStore.delete('next-auth.session-token')
    cookieStore.delete('next-auth.callback-url')
    cookieStore.delete('next-auth.csrf-token')
  } catch (error) {
    // Даже при ошибке очищаем cookies
    try {
      const cookieStore = await cookies()
      cookieStore.delete('authjs.session-token')
      cookieStore.delete('authjs.callback-url')
    } catch (cookieError) {
      // Cookie cleanup error - ignore
    }
  }

  // Принудительное перенаправление для обновления состояния
  redirect('/')
}

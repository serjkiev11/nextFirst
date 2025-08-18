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

    // Очищаем только основной NextAuth cookie
    cookieStore.delete('authjs.session-token')
  } catch (error) {
    // Даже при ошибке очищаем cookies
    try {
      const cookieStore = await cookies()
      cookieStore.delete('authjs.session-token')
    } catch (cookieError) {
      // Cookie cleanup error - ignore
    }
  }

  // Принудительное перенаправление для обновления состояния
  redirect('/')
}

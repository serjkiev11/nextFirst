'use server'

import { signIn } from '@/auth/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function signInWithCredentials(email: string, password: string) {
  try {
    // Убираем redirectTo, чтобы NextAuth создал сессию
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Важно! Не перенаправляем автоматически
    })
    if (result && !result.error) {
      redirect('/')
    } else {
      throw new Error('Неверные данные для входа')
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Пропускаем наш редирект дальше
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Неверные учетные данные' }
        default:
          return { error: 'Что-то пошло не так' }
      }
    }

    return { error: 'Произошла неожиданная ошибка' }
  }
}

'use server'

import { signIn } from '@/auth/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function signInWithCredentials(email: string, password: string) {
  console.log('🚀 signInWithCredentials called with:', {
    email,
    passwordLength: password.length,
  })

  try {
    console.log('📞 Calling NextAuth signIn...')

    // Убираем redirectTo, чтобы NextAuth создал сессию
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Важно! Не перенаправляем автоматически
    })

    console.log('✅ SignIn result:', result)

    // Если результат есть и нет ошибок - успех
    if (result && !result.error) {
      console.log('🎉 Login successful, redirecting...')
      // Перенаправляем вручную после создания сессии
      redirect('/')
    } else {
      console.log('❌ Login failed:', result?.error)
      throw new Error('Неверные данные для входа')
    }
  } catch (error) {
    console.log('🚨 signIn error:', error)

    // NEXT_REDIRECT от нашего redirect() - это успех
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

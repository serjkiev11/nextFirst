'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Еще загружается

    if (!session) {
      // Перенаправляем на страницу error если не авторизован
      router.push('/error?message=Не достаточно прав')
    }
  }, [session, status, router])

  // Показываем загрузку пока проверяем сессию
  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div>Проверка авторизации...</div>
      </div>
    )
  }

  // Если не авторизован, показываем пустой компонент (пока идет редирект)
  if (!session) {
    return null
  }

  // Если авторизован, показываем контент
  return <>{children}</>
}

'use client'

import { siteConfig } from '@/config/site.config'
import { usePathname } from 'next/navigation'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'

const PageContent = () => {
  const pathName = usePathname()
  const pageContent =
    siteConfig.pagesContent[pathName as keyof typeof siteConfig.pagesContent]

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!pageContent) {
    return <div>Страница не найдена</div>
  }

  // На сервере показываем загрузку, на клиенте - контент
  if (!isClient) {
    return (
      <div className='prose prose-lg max-w-4xl mx-auto p-6 text-foreground'>
        <div>Загрузка...</div>
      </div>
    )
  }

  return (
    <article className='prose prose-lg max-w-4xl mx-auto p-6 text-foreground'>
      {parse(pageContent.content)}
    </article>
  )
}

export default PageContent

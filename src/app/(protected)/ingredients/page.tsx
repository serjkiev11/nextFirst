'use client'

import IngredientForm from '@/forms/ingredient.form'
import { useIngredientStore } from '@/store/ingredient.store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import IngredientsTable from '@/components/ui/tables/Ingredients'

export default function IngredientsPage() {
  const { data: session } = useSession()
  const { loadIngredients, error } = useIngredientStore()

  const isAuth = !!session?.user

  useEffect(() => {
    if (isAuth) {
      loadIngredients()
    }
  }, [isAuth, loadIngredients])

  if (error) {
    return <div>Ошибка: {error}</div>
  }

  return (
    <div className='w-[756px]'>
      <IngredientForm />
      <IngredientsTable isAuth={isAuth} />
    </div>
  )
}

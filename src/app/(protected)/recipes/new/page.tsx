'use client'

import RecipeForm from '@/forms/recipe.form'

export default function NewRecipePage() {
  return (
    <div className='flex justify-center w-full p-4'>
      <div className='w-[450px]'>
        <h1 className='text-3xl font-bold mb-4'>Создать новый рецепт</h1>
        <RecipeForm />
      </div>
    </div>
  )
}

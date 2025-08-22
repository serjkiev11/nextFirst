'use server'

import { ingredientSchema } from '@/schema/zod'
import { prisma } from '@/utils/prisma'
import { ZodError } from 'zod'

export async function createIngredient(formData: FormData) {
  try {
    console.log('formData', FormData)

    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
      pricePerUnit: formData.get('pricePerUnit')
        ? parseFloat(formData.get('pricePerUnit') as string)
        : null,
      description: formData.get('description') as string,
    }

    const validateData = ingredientSchema.parse(data)

    const ingredient = await prisma.ingredient.create({
      data: {
        name: validateData.name,
        category: validateData.category,
        unit: validateData.unit,
        pricePerUnit: validateData.pricePerUnit,
        description: validateData.description,
      },
    })

    return { success: true, ingredient }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') }
    }

    console.log('Ошибка создания ингредиента', error)
    return { error: 'Ошибка создания ингредиента' }
  }
}

export async function getIngredients() {
  try {
    const ingredients = await prisma.ingredient.findMany()

    return { success: true, ingredients }
  } catch (error) {
    console.log('Ошибка получения ингредиентов')
    return { error: 'Ошибка при получении ингредиентов' }
  }
}

export async function deleteIngredient(id: string) {
  try {
    const ingredient = await prisma.ingredient.delete({
      where: { id },
    })

    return { success: true, ingredient }
  } catch (error) {
    console.log('Ошибка удаления ингредиента')
    return { error: 'Ошибка при удалении ингредиента' }
  }
}

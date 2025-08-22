import { getRecipes, createRecipe } from '@/actions/recipe'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await getRecipes()

    if (result.success) {
      return NextResponse.json({ success: true, recipes: result.recipes })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error fetching recipes:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при загрузке рецептов' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const result = await createRecipe(formData)

    if (result.success) {
      return NextResponse.json({ success: true, recipe: result.recipe })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('API Error creating recipe:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при создании рецепта' },
      { status: 500 }
    )
  }
}

import { getIngredients } from '@/actions/ingredients'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await getIngredients()

    if (result.success) {
      return NextResponse.json({
        success: true,
        ingredients: result.ingredients,
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error fetching ingredients:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при загрузке ингредиентов' },
      { status: 500 }
    )
  }
}

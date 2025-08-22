'use server'

import { IFormData } from '@/types/form.data'
import { saltAndHashPassword } from '@/utils/password'
import { prisma } from '@/utils/prisma'
import { signIn } from '@/auth/auth'

export async function registerUser(formData: IFormData) {
  const { email, password, confirmPassword } = formData

  if (password !== confirmPassword) {
    throw new Error('Пароли не совпадают')
  }

  if (password.length < 6) {
    throw new Error('Пароль должен быть не менее 6 символов')
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const pwHash = await saltAndHashPassword(password)

    const user = await prisma.user.create({
      data: {
        email: email,
        password: pwHash,
      },
    })

    // Автоматически входим в систему после регистрации
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    // Вместо redirect используем возврат успеха
    return { success: true }
  } catch (error) {
    // Если это ошибка базы данных или signIn - пробрасываем её дальше
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Ошибка регистрации')
  }
}

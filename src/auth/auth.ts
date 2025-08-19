import NextAuth from 'next-auth'
import { ZodError } from 'zod'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { signInSchema } from '../schema/zod'
import { getUserFromDb } from '@/utils/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 дней
  },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `authjs.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0, // Мгновенно истекает
      },
    },
  },
  pages: {
    signIn: '/', // Перенаправляем на главную вместо отдельной страницы входа
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      }
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email и пароль обязательны')
          }

          const { email, password } = await signInSchema.parseAsync(credentials)

          // logic to verify if the user exists
          const user = await getUserFromDb(email)

          if (!user) {
            throw new Error('Неверный ввод данных.')
          }

          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error('Неверный ввод данных.')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.email, // NextAuth ожидает name
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          return null
        }
      },
    }),
  ],
})

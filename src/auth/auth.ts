import NextAuth from 'next-auth'
import { ZodError } from 'zod'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { signInSchema } from '../schema/zod'
import { getUserFromDb } from '@/utils/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/utils/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
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
      },
    },
    csrfToken: {
      name: `authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/', // Перенаправляем на главную вместо отдельной страницы входа
  },
  callbacks: {
    jwt: ({ token, user }) => {
      console.log('📍 NextAuth JWT callback:', { token, user })
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      console.log('📍 NextAuth session callback:', { session, token })
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
          console.log('🔍 Authorize started with:', {
            email: credentials?.email,
          })

          if (!credentials?.email || !credentials?.password) {
            console.log('❌ Missing credentials')
            throw new Error('Email и пароль обязательны')
          }

          const { email, password } = await signInSchema.parseAsync(credentials)
          console.log('✅ Schema validation passed')

          // logic to verify if the user exists
          const user = await getUserFromDb(email)
          console.log('👤 User found:', user ? 'Yes' : 'No')

          if (!user) {
            console.log('❌ User not found')
            throw new Error('Неверный ввод данных.')
          }

          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password
          )
          console.log('🔐 Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('❌ Invalid password')
            throw new Error('Неверный ввод данных.')
          }

          console.log('✅ Login successful, returning user data')
          return {
            id: user.id,
            email: user.email,
            name: user.email, // NextAuth ожидает name
          }
        } catch (error) {
          console.log('🚨 Auth error:', error)
          if (error instanceof ZodError) {
            return null
          }
          return null
        }
      },
    }),
  ],
})

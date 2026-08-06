import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const email = credentials.email.trim().toLowerCase()
        const headerList = headers()
        const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

        const ipRl = rateLimit({ key: `login-ip:${ip}`, windowMs: 60_000, max: 30 })
        if (ipRl.limited) {
          throw new Error('Too many login attempts. Please try again later.')
        }

        const emailRl = rateLimit({ key: `login:${email}:${ip}`, windowMs: 15 * 60_000, max: 10 })
        if (emailRl.limited) {
          throw new Error('Too many login attempts. Please try again later.')
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'CUSTOMER'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as string) || 'CUSTOMER'
      }
      return session
    },
  },
}
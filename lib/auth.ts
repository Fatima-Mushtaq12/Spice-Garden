import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import type { Role } from '@prisma/client'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Demo users — work without a real database
        const demoUsers: Record<string, { id: string; name: string; role: Role; password: string }> = {
          'admin@spicegarden.pk': { id: 'demo-admin', name: 'Admin User', role: 'ADMIN', password: 'SpiceGarden2024!' },
          'staff@spicegarden.pk': { id: 'demo-staff', name: 'Staff Member', role: 'STAFF', password: 'SpiceGarden2024!' },
        }

        const demo = demoUsers[credentials.email as string]
        if (demo && credentials.password === demo.password) {
          return { id: demo.id, email: credentials.email as string, name: demo.name, role: demo.role }
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })
          if (!user) return null
          return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role as Role
        token.id = user.id
      }
      if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } })
        if (dbUser) token.role = dbUser.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
})

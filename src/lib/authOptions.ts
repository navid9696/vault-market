import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null
				const user = await prisma.user.findUnique({ where: { email: credentials.email } })
				if (!user || !user.password) return null

				const isValid = await bcrypt.compare(credentials.password, user.password)
				if (!isValid) return null

				return { id: user.id, email: user.email }
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60,
		updateAge: 60 * 60,
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) token.id = user.id
			return token
		},
		async session({ session, token }) {
			if (session?.user) session.user.id = token.id as string
			return session
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
}

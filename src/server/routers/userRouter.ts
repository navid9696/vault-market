import { procedure, router } from '../trpc'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { registerSchema } from '~/schemas/registerSchema'
import { z } from 'zod'

const prisma = new PrismaClient()

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Your email address cannot be empty.' })
		.email({ message: 'Please enter a valid email address.' }),

	password: z.string().min(1, { message: 'Password cannot be empty.' }),
})

export const userRouter = router({
	registerUser: procedure.input(registerSchema).mutation(async ({ input }) => {
		const { email, password } = input

		const existingUser = await prisma.users.findUnique({ where: { email } })
		if (existingUser) {
			throw new Error('Email already in use')
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await prisma.users.create({
			data: {
				email,
				password: hashedPassword,
			},
		})

		return {
			id: newUser.id,
			email: newUser.email,
			createdAt: newUser.createdAt,
		}
	}),

	loginUser: procedure.input(loginSchema).mutation(async ({ input }) => {
		const { email, password } = input

		const user = await prisma.users.findUnique({ where: { email } })
		if (!user) {
			throw new Error('Invalid email')
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			throw new Error('Invalid password')
		}

		return {
			id: user.id,
			email: user.email,
			createdAt: user.createdAt,
		}
	}),
})

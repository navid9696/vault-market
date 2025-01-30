import { procedure, router } from '../trpc'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { registerSchema } from '~/schemas/registerSchema'

const prisma = new PrismaClient()

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
})

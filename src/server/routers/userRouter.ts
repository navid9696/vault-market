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

export const addressSchema = z.object({
	address: z.string().min(1, { message: 'Address is required' }),
	addressOptional: z.string().optional(),
	city: z.string().min(1, { message: 'City is required' }),
	state: z.string().min(1, { message: 'State is required' }),
	zipCode: z.string().min(1, { message: 'Zip code is required' }),
})

export const userRouter = router({
	registerUser: procedure.input(registerSchema).mutation(async ({ input }) => {
		const { email, password } = input

		const existingUser = await prisma.user.findUnique({ where: { email } })
		if (existingUser) {
			throw new Error('Email already in use')
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await prisma.user.create({
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
	updateAddress: procedure.input(addressSchema).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				address: {
					street: input.address,
					addressOptional: input.addressOptional,
					city: input.city,
					state: input.state,
					zipCode: input.zipCode,
				},
			},
		})
		return updatedUser
	}),
	getAddress: procedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { address: true },
		})
		return user?.address
	}),
})

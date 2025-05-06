import { procedure, router } from '../trpc'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { registerSchema } from '~/schemas/registerSchema'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { updatePasswordSchema } from '~/schemas/passwordSchema'

const prisma = new PrismaClient()

export const userRouter = router({
	getUserName: procedure.query(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { name: true, email: true },
		})
		if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
		return user
	}),

	registerUser: procedure.input(registerSchema).mutation(async ({ input }) => {
		const { email, password } = input
		const existing = await prisma.user.findUnique({ where: { email } })
		if (existing) throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' })
		const hashed = await bcrypt.hash(password, 10)
		const u = await prisma.user.create({
			data: { email, password: hashed },
		})
		return { id: u.id, email: u.email, createdAt: u.createdAt }
	}),

	updateAddress: procedure
		.input(
			z.object({
				address: z.string().min(1),
				addressOptional: z.string().optional(),
				city: z.string().min(1),
				state: z.string().min(1),
				zipCode: z.string().min(1),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session?.sub
			if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
			return prisma.user.update({
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
		}),

	getAddress: procedure.query(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
		const u = await prisma.user.findUnique({
			where: { id: userId },
			select: { address: true },
		})
		return u?.address
	}),

	updateName: procedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
		return prisma.user.update({
			where: { id: userId },
			data: { name: input.name },
			select: { name: true },
		})
	}),

	updateEmail: procedure.input(z.object({ email: z.string().email() })).mutation(async ({ ctx, input }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
		return prisma.user.update({
			where: { id: userId },
			data: { email: input.email },
			select: { email: true },
		})
	}),
	updatePassword: procedure.input(updatePasswordSchema).mutation(async ({ ctx, input }) => {
		const userId = ctx.session?.sub
		if (!userId) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
		}
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { password: true },
		})
		if (!user || !user.password) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
		}
		const valid = await bcrypt.compare(input.currentPassword, user.password)
		if (!valid) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Current password is incorrect' })
		}
		const newHash = await bcrypt.hash(input.password, 10)
		await prisma.user.update({
			where: { id: userId },
			data: { password: newHash },
		})
		return { success: true }
	}),
	deleteAccount: procedure.mutation(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
		}
		await prisma.user.delete({
			where: { id: userId },
		})
		return { success: true }
	}),
})

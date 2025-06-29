import { nullable, z } from 'zod'
import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'

const prisma = new PrismaClient()

const capsOrderInputSchema = z.object({
	quantity: z.number().min(1),
	usd: z.number(),
})

const capsOrderOutputSchema = z.object({
	id: z.string(),
	userId: z.string().nullable(),
	quantity: z.number(),
	usdValue: z.number(),
	createdAt: z.date(),
})

const totalCapsSchema = z.object({
	total: z.number(),
})

export const capsOrderRouter = router({
	createCapsOrder: procedure
		.input(capsOrderInputSchema)
		.output(capsOrderOutputSchema)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session?.sub
			if (!userId) throw new Error('Not authenticated')

			const order = await prisma.capsOrder.create({
				data: {
					user: { connect: { id: userId } },
					quantity: input.quantity,
					usdValue: input.usd,
				},
			})

			return order
		}),

	getCapsOrders: procedure.output(z.array(capsOrderOutputSchema)).query(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const orders = await prisma.capsOrder.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})
		return orders
	}),

	getCapsOrdersByUser: procedure
		.input(
			z.object({
				userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
				page: z.number().min(1),
				limit: z.number().min(1).max(100),
			})
		)
		.output(
			z.object({
				orders: z.array(capsOrderOutputSchema),
				total: z.number(),
			})
		)
		.query(async ({ ctx, input }) => {
			if (ctx.session?.role !== 'ADMIN') {
				throw new TRPCError({ code: 'FORBIDDEN' })
			}
			const skip = (input.page - 1) * input.limit
			const [orders, total] = await Promise.all([
				prisma.capsOrder.findMany({
					where: { userId: input.userId },
					skip,
					take: input.limit,
					orderBy: { createdAt: 'desc' },
				}),
				prisma.capsOrder.count({ where: { userId: input.userId } }),
			])
			return { orders, total }
		}),

	getTotalCaps: procedure.output(totalCapsSchema).query(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const aggregate = await prisma.capsOrder.aggregate({
			_sum: { quantity: true },
			where: { userId },
		})

		const total = aggregate._sum.quantity ?? 0
		return { total }
	}),

	spendCaps: procedure.input(z.object({ amount: z.number().min(1) })).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const aggregate = await prisma.capsOrder.aggregate({
			_sum: { quantity: true },
			where: { userId },
		})

		const totalCaps = aggregate._sum.quantity ?? 0
		const spentCaps = await prisma.userOrders.aggregate({
			_sum: { totalAmount: true },
			where: { userId },
		})

		const totalSpent = spentCaps._sum.totalAmount ?? 0
		const availableCaps = totalCaps - totalSpent

		if (availableCaps < input.amount) {
			throw new Error('Not enough caps')
		}

		return { success: true, remainingCaps: availableCaps - input.amount }
	}),

	getCapsBalance: procedure.output(z.object({ balance: z.number() })).query(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const aggregate = await prisma.capsOrder.aggregate({
			_sum: { quantity: true },
			where: { userId },
		})
		const spent = await prisma.userOrders.aggregate({
			_sum: { totalAmount: true },
			where: { userId },
		})

		const balance = (aggregate._sum.quantity ?? 0) - (spent._sum.totalAmount ?? 0)
		return { balance }
	}),
})

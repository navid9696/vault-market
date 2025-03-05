import { z } from 'zod'
import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const capsOrderInputSchema = z.object({
	quantity: z.number().min(1),
	usd: z.number(),
})

const capsOrderOutputSchema = z.object({
	id: z.string(),
	userId: z.string(),
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
			const userId = ctx.session?.user?.id
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
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const orders = await prisma.capsOrder.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})
		return orders
	}),

	getTotalCaps: procedure.output(totalCapsSchema).query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const aggregate = await prisma.capsOrder.aggregate({
			_sum: { quantity: true },
			where: { userId },
		})

		const total = aggregate._sum.quantity ?? 0
		return { total }
	}),
})

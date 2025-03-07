import { z } from 'zod'
import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cartItemInputSchema = z.object({
	productId: z.string(),
	quantity: z.number().min(1),
})

const totalItemsSchema = z.object({
	total: z.number(),
})

export const userCartRouter = router({
	addCartItem: procedure.input(cartItemInputSchema).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const existingItem = await prisma.userCart.findUnique({
			where: {
				userId_productId_cart: {
					userId,
					productId: input.productId,
				},
			},
		})

		if (existingItem) {
			const updatedItem = await prisma.userCart.update({
				where: {
					userId_productId_cart: {
						userId,
						productId: input.productId,
					},
				},
				data: { quantity: existingItem.quantity + input.quantity },
			})
			return updatedItem
		} else {
			const newItem = await prisma.userCart.create({
				data: {
					user: { connect: { id: userId } },
					product: { connect: { id: input.productId } },
					quantity: input.quantity,
				},
			})
			return newItem
		}
	}),

	updateCartItem: procedure.input(cartItemInputSchema).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const updatedItem = await prisma.userCart.update({
			where: {
				userId_productId_cart: { userId, productId: input.productId },
			},
			data: { quantity: input.quantity },
		})
		return updatedItem
	}),

	removeCartItem: procedure
		.input(
			z.object({
				productId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session?.user?.id
			if (!userId) throw new Error('Not authenticated')

			const removedItem = await prisma.userCart.delete({
				where: {
					userId_productId_cart: { userId, productId: input.productId },
				},
			})
			return removedItem
		}),

	getCartItems: procedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const items = await prisma.userCart.findMany({
			where: { userId },
			include: { product: true },
			orderBy: { createdAt: 'asc' },
		})
		return items
	}),

	getTotalItems: procedure.output(totalItemsSchema).query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')

		const aggregate = await prisma.userCart.aggregate({
			_sum: { quantity: true },
			where: { userId },
		})

		return { total: aggregate._sum.quantity ?? 0 }
	}),
})

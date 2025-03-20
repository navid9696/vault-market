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
		const result = await prisma.$transaction(async prisma => {
			const product = await prisma.products.findUnique({ where: { id: input.productId } })
			if (!product) throw new Error('Product not found')
			if (product.available < input.quantity) throw new Error('Not enough items available')
			const existingItem = await prisma.userCart.findUnique({
				where: { userId_productId_cart: { userId, productId: input.productId } },
			})
			let cartItem
			if (existingItem) {
				cartItem = await prisma.userCart.update({
					where: { userId_productId_cart: { userId, productId: input.productId } },
					data: { quantity: existingItem.quantity + input.quantity },
				})
			} else {
				cartItem = await prisma.userCart.create({
					data: {
						user: { connect: { id: userId } },
						product: { connect: { id: input.productId } },
						quantity: input.quantity,
					},
				})
			}
			await prisma.products.update({
				where: { id: input.productId },
				data: { available: { decrement: input.quantity } },
			})
			return cartItem
		})
		return result
	}),

	updateCartItem: procedure.input(cartItemInputSchema).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')
		const result = await prisma.$transaction(async prisma => {
			const existingItem = await prisma.userCart.findUnique({
				where: { userId_productId_cart: { userId, productId: input.productId } },
			})
			if (!existingItem) throw new Error('Cart item not found')
			const diff = input.quantity - existingItem.quantity
			if (diff > 0) {
				const product = await prisma.products.findUnique({ where: { id: input.productId } })
				if (!product) throw new Error('Product not found')
				if (product.available < diff) throw new Error('Not enough items available')
				await prisma.products.update({
					where: { id: input.productId },
					data: { available: { decrement: diff } },
				})
			} else if (diff < 0) {
				await prisma.products.update({
					where: { id: input.productId },
					data: { available: { increment: -diff } },
				})
			}
			const updatedItem = await prisma.userCart.update({
				where: { userId_productId_cart: { userId, productId: input.productId } },
				data: { quantity: input.quantity },
			})
			return updatedItem
		})
		return result
	}),

	removeCartItem: procedure.input(z.object({ productId: z.string() })).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')
		const result = await prisma.$transaction(async prisma => {
			const cartItem = await prisma.userCart.findUnique({
				where: { userId_productId_cart: { userId, productId: input.productId } },
			})
			if (!cartItem) throw new Error('Cart item not found')
			await prisma.products.update({
				where: { id: input.productId },
				data: { available: { increment: cartItem.quantity } },
			})
			const removedItem = await prisma.userCart.delete({
				where: { userId_productId_cart: { userId, productId: input.productId } },
			})
			return removedItem
		})
		return result
	}),

	getCartItems: procedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')
		const items = await prisma.userCart.findMany({
			where: { userId },
			include: { product: true },
			orderBy: { createdAt: 'asc' },
		})
		return items.filter(item => item.product !== null)
	}),

	getTotalItems: procedure.output(totalItemsSchema).query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id
		if (!userId) throw new Error('Not authenticated')
		const items = await prisma.userCart.findMany({
			where: { userId },
			include: { product: true },
		})
		const filteredItems = items.filter(item => item.product !== null)
		const total = filteredItems.reduce((sum, item) => sum + item.quantity, 0)
		return { total }
	}),
})

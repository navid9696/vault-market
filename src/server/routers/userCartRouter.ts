import { z } from 'zod'
import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'
import { resolveCartKey } from '~/utils/resolveCartKey'

const prisma = new PrismaClient()

const withGid = z.object({ gid: z.string().optional() })
const cartItemInputSchema = z.object({
	productId: z.string(),
	quantity: z.number().min(1),
	gid: z.string().optional(),
})
const removeInputSchema = z.object({
	productId: z.string(),
	gid: z.string().optional(),
})
const totalItemsSchema = z.object({ total: z.number() })

export const userCartRouter = router({
	addCartItem: procedure.input(cartItemInputSchema).mutation(async ({ input, ctx }) => {
		const key = resolveCartKey(ctx.session, input.gid)
		const result = await prisma.$transaction(async tx => {
			const product = await tx.products.findUnique({ where: { id: input.productId } })
			if (!product) throw new Error('Product not found')
			if (product.available < input.quantity) throw new Error('Not enough items available')

			let cartItem
			if (key.userId) {
				const existing = await tx.userCart.findUnique({
					where: { userId_productId_cart: { userId: key.userId, productId: input.productId } },
				})
				cartItem = existing
					? await tx.userCart.update({
							where: { userId_productId_cart: { userId: key.userId, productId: input.productId } },
							data: { quantity: existing.quantity + input.quantity },
					  })
					: await tx.userCart.create({
							data: {
								user: { connect: { id: key.userId } },
								product: { connect: { id: input.productId } },
								quantity: input.quantity,
							},
					  })
			} else {
				const cartId = key.cartId as string
				const existing = await tx.userCart.findUnique({
					where: { cartId_productId_cart: { cartId, productId: input.productId } },
				})
				cartItem = existing
					? await tx.userCart.update({
							where: { cartId_productId_cart: { cartId, productId: input.productId } },
							data: { quantity: existing.quantity + input.quantity },
					  })
					: await tx.userCart.create({
							data: { cartId, product: { connect: { id: input.productId } }, quantity: input.quantity },
					  })
			}

			await tx.products.update({ where: { id: input.productId }, data: { available: { decrement: input.quantity } } })
			return cartItem
		})
		return result
	}),

	updateCartItem: procedure.input(cartItemInputSchema).mutation(async ({ input, ctx }) => {
		const key = resolveCartKey(ctx.session, input.gid)
		const result = await prisma.$transaction(async tx => {
			const existing = key.userId
				? await tx.userCart.findUnique({
						where: { userId_productId_cart: { userId: key.userId, productId: input.productId } },
				  })
				: await tx.userCart.findUnique({
						where: { cartId_productId_cart: { cartId: key.cartId as string, productId: input.productId } },
				  })
			if (!existing) throw new Error('Cart item not found')

			const diff = input.quantity - existing.quantity
			if (diff > 0) {
				const product = await tx.products.findUnique({ where: { id: input.productId } })
				if (!product) throw new Error('Product not found')
				if (product.available < diff) throw new Error('Not enough items available')
				await tx.products.update({ where: { id: input.productId }, data: { available: { decrement: diff } } })
			} else if (diff < 0) {
				await tx.products.update({ where: { id: input.productId }, data: { available: { increment: -diff } } })
			}

			const updated = key.userId
				? await tx.userCart.update({
						where: { userId_productId_cart: { userId: key.userId, productId: input.productId } },
						data: { quantity: input.quantity },
				  })
				: await tx.userCart.update({
						where: { cartId_productId_cart: { cartId: key.cartId as string, productId: input.productId } },
						data: { quantity: input.quantity },
				  })
			return updated
		})
		return result
	}),

	removeCartItem: procedure.input(removeInputSchema).mutation(async ({ input, ctx }) => {
		const key = resolveCartKey(ctx.session, input.gid)
		const result = await prisma.$transaction(async tx => {
			const cartItem = key.userId
				? await tx.userCart.findUnique({
						where: { userId_productId_cart: { userId: key.userId, productId: input.productId } },
				  })
				: await tx.userCart.findUnique({
						where: { cartId_productId_cart: { cartId: key.cartId as string, productId: input.productId } },
				  })
			if (!cartItem) throw new Error('Cart item not found')

			await tx.products.update({
				where: { id: input.productId },
				data: { available: { increment: cartItem.quantity } },
			})

			const removed = key.userId
				? await tx.userCart.delete({
						where: { userId_productId_cart: { userId: key.userId, productId: input.productId } },
				  })
				: await tx.userCart.delete({
						where: { cartId_productId_cart: { cartId: key.cartId as string, productId: input.productId } },
				  })
			return removed
		})
		return result
	}),

	getCartItems: procedure.input(withGid.optional()).query(async ({ input, ctx }) => {
		const key = resolveCartKey(ctx.session, input?.gid)
		if (!key.userId && !key.cartId) return []
		const items = await prisma.userCart.findMany({
			where: key.userId ? { userId: key.userId } : { cartId: key.cartId as string },
			include: { product: true },
			orderBy: { createdAt: 'asc' },
		})
		return items.filter(i => i.product !== null)
	}),

	getTotalItems: procedure
		.input(withGid.optional())
		.output(totalItemsSchema)
		.query(async ({ input, ctx }) => {
			const key = resolveCartKey(ctx.session, input?.gid)
			if (!key.userId && !key.cartId) return { total: 0 }
			const items = await prisma.userCart.findMany({
				where: key.userId ? { userId: key.userId } : { cartId: key.cartId as string },
			})
			const total = items.reduce((s, i) => s + i.quantity, 0)
			return { total }
		}),

	clearCart: procedure.input(withGid.optional()).mutation(async ({ input, ctx }) => {
		const key = resolveCartKey(ctx.session, input?.gid)
		if (!key.userId && !key.cartId) return { success: true }
		await prisma.userCart.deleteMany({ where: key.userId ? { userId: key.userId } : { cartId: key.cartId as string } })
		return { success: true }
	}),
	mergeGuestCart: procedure.input(z.object({ gid: z.string().optional() })).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.sub
		if (!userId || !input?.gid) return { merged: 0 }
		const merged = await prisma.$transaction(async tx => {
			const guestItems = await tx.userCart.findMany({ where: { cartId: input.gid }, include: { product: true } })
			let count = 0
			for (const gi of guestItems) {
				if (!gi.product) continue
				const existing = await tx.userCart.findUnique({
					where: { userId_productId_cart: { userId, productId: gi.productId } },
				})
				if (existing) {
					await tx.userCart.update({
						where: { userId_productId_cart: { userId, productId: gi.productId } },
						data: { quantity: existing.quantity + gi.quantity },
					})
				} else {
					await tx.userCart.create({
						data: {
							user: { connect: { id: userId } },
							product: { connect: { id: gi.productId } },
							quantity: gi.quantity,
						},
					})
				}
				count++
			}
			await tx.userCart.deleteMany({ where: { cartId: input.gid } })
			return count
		})
		return { merged }
	}),
})

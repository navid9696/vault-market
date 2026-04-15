import { z } from 'zod'
import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'
import { CartKey, resolveCartKey } from '~/utils/resolveCartKey'
import { TRPCError } from '@trpc/server'

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

const requireCartKey = (key: CartKey): { userId?: string; cartId?: string } => {
	if (key.userId || key.cartId) return key
	throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing cart identity' })
}

const cleanupExpiredItems = async (key: CartKey) => {
	const expirationMs = key.userId ? 12 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000
	const cutoff = new Date(Date.now() - expirationMs)
	const expiredItems = await prisma.userCart.findMany({
		where: {
			...(key.userId ? { userId: key.userId } : { cartId: key.cartId }),
			createdAt: { lt: cutoff },
		},
	})

	if (expiredItems.length === 0) return

	await prisma.$transaction(async tx => {
		for (const item of expiredItems) {
			await tx.products.update({
				where: { id: item.productId },
				data: { available: { increment: item.quantity } },
			})
		}
		await tx.userCart.deleteMany({
			where: {
				...(key.userId ? { userId: key.userId } : { cartId: key.cartId }),
				createdAt: { lt: cutoff },
			},
		})
	})
}

export const userCartRouter = router({
	addCartItem: procedure.input(cartItemInputSchema).mutation(async ({ input, ctx }) => {
		const key = requireCartKey(resolveCartKey(ctx.session, input.gid))
		const result = await prisma.$transaction(async tx => {
			const product = await tx.products.findUnique({ where: { id: input.productId } })
			if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
			if (product.available < input.quantity) {
				throw new TRPCError({ code: 'CONFLICT', message: 'Not enough items available' })
			}

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
		const key = requireCartKey(resolveCartKey(ctx.session, input.gid))
		const result = await prisma.$transaction(async tx => {
			const cartWhere = key.userId
				? { userId_productId_cart: { userId: key.userId, productId: input.productId } }
				: { cartId_productId_cart: { cartId: key.cartId as string, productId: input.productId } }

			const existing = await tx.userCart.findUnique({ where: cartWhere })
			if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cart item not found' })

			const diff = input.quantity - existing.quantity
			if (diff === 0) return existing

			if (diff > 0) {
				const reserved = await tx.products.updateMany({
					where: { id: input.productId, available: { gte: diff } },
					data: { available: { decrement: diff } },
				})

				if (reserved.count === 0) {
					const productExists = await tx.products.count({ where: { id: input.productId } })
					if (!productExists) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
					throw new TRPCError({ code: 'CONFLICT', message: 'Not enough items available' })
				}
			} else {
				await tx.products.update({
					where: { id: input.productId },
					data: { available: { increment: Math.abs(diff) } },
				})
			}

			return tx.userCart.update({
				where: cartWhere,
				data: { quantity: input.quantity },
			})
		})
		return result
	}),

	removeCartItem: procedure.input(removeInputSchema).mutation(async ({ input, ctx }) => {
		const key = requireCartKey(resolveCartKey(ctx.session, input.gid))
		const result = await prisma.$transaction(async tx => {
			const cartItem = key.userId
				? await tx.userCart.findUnique({
						where: { userId_productId_cart: { userId: key.userId, productId: input.productId } },
					})
				: await tx.userCart.findUnique({
						where: { cartId_productId_cart: { cartId: key.cartId as string, productId: input.productId } },
					})
			if (!cartItem) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cart item not found' })

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
		await cleanupExpiredItems(key)
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
			await cleanupExpiredItems(key)
			const totals = await prisma.userCart.aggregate({
				where: key.userId ? { userId: key.userId } : { cartId: key.cartId as string },
				_sum: { quantity: true },
			})
			return { total: totals._sum.quantity ?? 0 }
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
		const guestKey = { cartId: input.gid }
		await cleanupExpiredItems(guestKey)
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

import { z } from 'zod'
import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const favoriteRouter = router({
	addFavorite: procedure.input(z.object({ productId: z.string() })).mutation(async ({ input, ctx }) => {
		try {
			const userId = ctx.session?.sub
			if (!userId) throw new Error('Not authenticated')

			const product = await prisma.products.findUnique({ where: { id: input.productId } })
			if (!product) {
				throw new Error('Product does not exist')
			}

			const existingFavorite = await prisma.favorite.findUnique({
				where: {
					userId_productId: {
						userId: userId,
						productId: input.productId,
					},
				},
			})

			if (existingFavorite) {
				return existingFavorite
			}

			const favorite = await prisma.favorite.create({
				data: {
					user: { connect: { id: userId } },
					product: { connect: { id: input.productId } },
				},
			})
			return favorite
		} catch (error) {
			console.error('Add favorite error:', error)
			throw error
		}
	}),

	removeFavorite: procedure.input(z.object({ productId: z.string() })).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const removed = await prisma.favorite.delete({
			where: {
				userId_productId: {
					userId: userId,
					productId: input.productId,
				},
			},
		})
		return removed
	}),

	getFavorites: procedure.query(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const favorites = await prisma.favorite.findMany({
			where: { userId },
			include: {
				product: true,
			},
		})
		return favorites.filter(fav => fav.product !== null)
	}),
})

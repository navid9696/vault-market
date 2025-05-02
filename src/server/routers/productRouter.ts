import { procedure, router } from '../trpc'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export const trpcProductSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	price: z.number().positive().max(9999),
	available: z.number().int().nonnegative(),
	popularity: z.number().int().nonnegative(),
	rating: z.number().nonnegative().default(0),
	discount: z.number().nonnegative().max(99),
	categoryName: z.string().min(1),
	subCategoryName: z.string().nullable().optional(),
	categoryId: z.number().int().nonnegative(),
	subCategoryId: z.number().int().nullable().optional(),
	imgURL: z.string().url(),
	description: z.string().min(1),
})

const prisma = new PrismaClient()

export const productRouter = router({
	addProduct: procedure.input(trpcProductSchema.omit({ id: true })).mutation(async ({ input }) => {
		try {
			const newProduct = await prisma.products.create({
				data: input,
			})
			return newProduct
		} catch (error) {
			throw new Error('Failed to add product: ' + (error as Error).message)
		}
	}),

	getProducts: procedure
		.input(
			z.object({
				search: z.string().optional(),
			})
		)
		.query(async ({ input }) => {
			try {
				const { search } = input || {}
				return await prisma.products.findMany({
					where: search
						? {
								name: {
									contains: search,
									mode: 'insensitive',
								},
						  }
						: {},
				})
			} catch (error) {
				throw new Error('Failed to retrieve products: ' + (error as Error).message)
			}
		}),

	editProduct: procedure.input(trpcProductSchema).mutation(async ({ input }) => {
		try {
			const updatedProduct = await prisma.products.update({
				where: { id: input.id },
				data: input,
			})
			return updatedProduct
		} catch (error) {
			throw new Error('Failed to edit products: ' + (error as Error).message)
		}
	}),

	deleteProduct: procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
		try {
			const deletedProduct = await prisma.products.delete({
				where: { id: input.id },
			})
			return deletedProduct
		} catch (error) {
			throw new Error('Failed to delete product: ' + (error as Error).message)
		}
	}),

	getById: procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		try {
			const product = await prisma.products.findUnique({
				where: { id: input.id },
			})
			if (!product) throw new Error('Product not found')
			return product
		} catch (error) {
			throw new Error('Failed to retrieve product: ' + (error as Error).message)
		}
	}),
	getComments: procedure.input(z.object({ productId: z.string() })).query(async ({ input }) => {
		return await prisma.comment.findMany({
			where: { productId: input.productId },
			orderBy: { createdAt: 'desc' },
			include: { user: { select: { id: true, name: true, image: true } } },
		})
	}),

	addComment: procedure
		.input(
			z.object({
				productId: z.string(),
				content: z.string().min(1).max(150),
				rating: z.number().int().min(0).max(5),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session?.sub
			if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

			const newComment = await prisma.comment.create({
				data: {
					content: input.content,
					rating: input.rating,
					product: { connect: { id: input.productId } },
					user: { connect: { id: userId } },
				},
				include: { user: { select: { id: true, name: true, image: true } } },
			})

			const agg = await prisma.comment.aggregate({
				where: { productId: input.productId },
				_avg: { rating: true },
			})

			await prisma.products.update({
				where: { id: input.productId },
				data: { rating: agg._avg.rating ?? 0 },
			})

			return newComment
		}),
})

import { connectToDB } from '~/lib/mongoose'
import Product from '../../../models/Product'
import { procedure, router } from '../trpc'
import { z } from 'zod'

export const trpcProductSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	price: z.number().positive().max(9999),
	available: z.number().int().nonnegative(),
	popularity: z.number().int().nonnegative().default(0),
	rating: z.number().int().nonnegative().default(0),
	discount: z.number().nonnegative().max(99),
	categoryName: z.string().min(1),
	subCategoryName: z.string().nullable().optional(),
	categoryId: z.number().int().nonnegative(),
	subCategoryId: z.number().int().nullable().optional(),
	imgURL: z.string().url(),
	description: z.string().min(1),
})

async function ensureDBConnection() {
	await connectToDB()
}

export const productRouter = router({
	addProduct: procedure.input(trpcProductSchema).mutation(async ({ input }) => {
		await ensureDBConnection()
		try {
			const newProduct = new Product(input)
			await newProduct.save()
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
			await ensureDBConnection()
			const { search } = input

			try {
				const products = await Product.find(search ? { name: { $regex: search, $options: 'i' } } : {})

				return products
			} catch (error) {
				throw new Error('Failed to retrieve products: ' + (error as Error).message)
			}
		}),

	editProduct: procedure.input(trpcProductSchema).mutation(async ({ input }) => {
		await ensureDBConnection()
		try {
			const updatedProduct = await Product.findOneAndUpdate({ id: input.id }, input, { new: true })
			if (!updatedProduct) throw new Error('Product not found')
			return updatedProduct
		} catch (error) {
			throw new Error('Failed to edit product: ' + (error as Error).message)
		}
	}),

	deleteProduct: procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
		await ensureDBConnection()
		try {
			const deletedProduct = await Product.findOneAndDelete({ id: input.id })
			if (!deletedProduct) throw new Error('Product not found')
			return deletedProduct
		} catch (error) {
			throw new Error('Failed to delete product: ' + (error as Error).message)
		}
	}),
})

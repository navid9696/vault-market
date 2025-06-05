import { z } from 'zod'
import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const orderItemSchema = z.object({
	productId: z.string(),
	name: z.string(),
	price: z.number(),
	quantity: z.number().min(1),
})

const createOrderSchema = z.object({
	shippingMethod: z.string(),
	address: z.object({
		street: z.string(),
		addressOptional: z.string().nullable().optional(),
		city: z.string(),
		state: z.string(),
		zipCode: z.string(),
	}),
	orderDate: z
		.preprocess(val => (typeof val === 'string' || val instanceof Date ? new Date(val) : val), z.date())
		.optional(),
	totalAmount: z.number(),
	orderItems: z.array(orderItemSchema),
})

export const orderRouter = router({
	createOrder: procedure.input(createOrderSchema).mutation(async ({ input, ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const order = await prisma.userOrders.create({
			data: {
				user: { connect: { id: userId } },
				street: input.address.street,
				addressOptional: input.address.addressOptional,
				city: input.address.city,
				state: input.address.state,
				zipCode: input.address.zipCode,
				shippingMethod: input.shippingMethod,
				orderDate: input.orderDate || new Date(),
				totalAmount: input.totalAmount,
				orderItems: {
					create: input.orderItems.map(item => ({
						productId: item.productId,
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					})),
				},
			},
			include: {
				orderItems: true,
			},
		})

		await Promise.all(
			order.orderItems.map(orderedItem =>
				prisma.products.update({
					where: { id: orderedItem.productId },
					data: {
						popularity: {
							increment: orderedItem.quantity,
						},
					},
				})
			)
		)

		return order
	}),

	getOrders: procedure.query(async ({ ctx }) => {
		const userId = ctx.session?.sub
		if (!userId) throw new Error('Not authenticated')

		const orders = await prisma.userOrders.findMany({
			where: { userId },
			include: {
				orderItems: true,
			},
			orderBy: { orderDate: 'desc' },
		})
		return orders
	}),
})

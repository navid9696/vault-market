import { z } from 'zod'

export const productSchema = z.object({
	name: z.string().min(1, { message: 'Product name is required' }),
	price: z.coerce
		.number()
		.positive({ message: 'Price must be a positive number' })
		.max(9999, { message: 'Value cannot exceed a 4-digit number' }),
	available: z.coerce
		.number()
		.int({ message: 'Availability must be an integer' })
		.nonnegative({ message: 'Availability cannot be negative' }),
	discount: z.coerce
		.number()
		.int({ message: 'Discount must be an integer' })
		.nonnegative({ message: 'Discount cannot be negative' })
		.max(99, { message: 'Cannot exceed 99% (free item)' })
		.default(0.0),
	categoryName: z.string().min(1, { message: 'Category is required' }),
	subCategoryName: z.coerce.string().nullable(),
	imgURL: z.string().url({ message: 'Must be a valid URL' }),
	description: z.string().min(1, { message: 'Description is required' }),
})

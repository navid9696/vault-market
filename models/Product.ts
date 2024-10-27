import mongoose from 'mongoose'
import { ProductCardProps } from '~/components/ProductCard'

const ProductSchema = new mongoose.Schema<ProductCardProps>({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true, unique: true },
	price: { type: Number, required: true },
	available: { type: Number, required: true },
	popularity: { type: Number, required: true, default: 0 },
	rating: { type: Number, required: true, default: 0 },
	onSale: { type: Number, required: true },
	categoryName: { type: String, required: true },
	subCategoryName: { type: String, default: null },
	categoryId: { type: Number, required: true },
	subCategoryId: {
		type: Number,
		default: null,
		required: false,
	},
	imgURL: { type: String, required: true },
	description: { type: String, required: true },
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

export default Product

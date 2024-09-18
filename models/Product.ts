import mongoose from 'mongoose'
import { ProductCardProps } from '~/components/ProductCard'

const ProductSchema = new mongoose.Schema<ProductCardProps>({
	name: { type: String, required: true, unique: true },
	price: { type: Number, required: true },
	rating: { type: Number, required: true },
	available: { type: Number, required: true },
	popularity: { type: Number, required: true },
	onSale: { type: Number, required: true },
	categoryId: { type: Number, required: true },
	subCategoryId: { type: Number, required: true },
	imgURL: { type: String, required: true },
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

export default Product

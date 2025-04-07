import { StateCreator } from 'zustand'
import { ProductCardProps } from '~/components/ProductCard'

export interface ProductSlice {
	product: ProductCardProps | null
	setProduct: (product: ProductCardProps) => void
	clearProduct: () => void
}

const createProductSlice: StateCreator<ProductSlice> = set => ({
	product: null,
	setProduct: product => set({ product }),
	clearProduct: () => set({ product: null }),
})

export default createProductSlice

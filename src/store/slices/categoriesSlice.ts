import { StateCreator } from 'zustand'

export interface CategoriesSlice {
	activeCategory: number | null
	activeSubCategory: number | null
	changeCategory: (category: number | null) => void
	changeSubCategory: (subCategory: number | null) => void
}

const createCategoriesSlice: StateCreator<CategoriesSlice> = set => ({
	activeCategory: null,
	activeSubCategory: null,
	changeCategory: category => set({ activeCategory: category }),
	changeSubCategory: subCategory => set({ activeSubCategory: subCategory }),
})

export default createCategoriesSlice

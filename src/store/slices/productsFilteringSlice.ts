import { StateCreator } from 'zustand'

export interface ProductsFilteringSlice {
	filtersOpen: boolean
	setFiltersOpen: (filtersOpen: boolean) => void
}

const createProductsFilteringSlice: StateCreator<ProductsFilteringSlice> = set => ({
	filtersOpen: true,
	setFiltersOpen: filtersOpen => set({ filtersOpen }),
})

export default createProductsFilteringSlice

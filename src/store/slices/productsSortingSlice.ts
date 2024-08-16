import { StateCreator } from 'zustand'

export interface ProductsSortingSlice {
	filtersOpen: boolean
	setFiltersOpen: (filtersOpen: boolean) => void
}

const createProductsSortingSlice: StateCreator<ProductsSortingSlice> = set => ({
	filtersOpen: true,
	setFiltersOpen: filtersOpen => set({ filtersOpen }),
})

export default createProductsSortingSlice

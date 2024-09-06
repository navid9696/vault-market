import { StateCreator } from 'zustand'

export interface CategoriesSlice {
  reducerState: {
    activeCategory: number | null
    activeSubCategory: number | null
  }
  setReducerState: (newState: { activeCategory: number | null, activeSubCategory: number | null }) => void
}

const createCategoriesSlice: StateCreator<CategoriesSlice> = (set) => ({
  reducerState: {
    activeCategory: null,
    activeSubCategory: null,
  },
  setReducerState: (newState) => set({ reducerState: newState }),
})

export default createCategoriesSlice

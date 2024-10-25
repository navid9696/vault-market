import { create } from 'zustand'

import createCategoriesSlice, { CategoriesSlice } from './slices/categoriesSlice'

export interface StoreState extends CategoriesSlice {}

const useStore = create<StoreState>((set, get, api) => ({
	...createCategoriesSlice(set, get, api),
}))

export default useStore

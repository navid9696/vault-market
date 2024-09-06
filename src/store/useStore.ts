import { create } from 'zustand'
import createSaleSlice, { SaleSlice } from './slices/saleSlice'
import createCategoriesSlice, { CategoriesSlice } from './slices/categoriesSlice'

export interface StoreState extends SaleSlice, CategoriesSlice {}

const useStore = create<StoreState>((set, get, api) => ({
	...createSaleSlice(set, get, api),
	...createCategoriesSlice(set, get, api),
}))

export default useStore

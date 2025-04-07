import { create } from 'zustand'
import createCategoriesSlice, { CategoriesSlice } from './slices/categoriesSlice'
import createSaleSlice, { SaleSlice } from './slices/saleSlice'
import createProductSlice, { ProductSlice } from './slices/productSlice'

export interface StoreState extends CategoriesSlice, SaleSlice, ProductSlice {}

const useStore = create<StoreState>((set, get, api) => ({
	...createCategoriesSlice(set, get, api),
	...createSaleSlice(set, get, api),
	...createProductSlice(set, get, api),
}))

export default useStore

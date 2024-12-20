import { create } from 'zustand'
import createCategoriesSlice, { CategoriesSlice } from './slices/categoriesSlice'
import createSaleSlice, { SaleSlice } from './slices/saleSlice' 

export interface StoreState extends CategoriesSlice, SaleSlice {} 

const useStore = create<StoreState>((set, get, api) => ({
	...createCategoriesSlice(set, get, api),
	...createSaleSlice(set, get, api), 
}))

export default useStore

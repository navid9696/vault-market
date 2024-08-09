import { create } from 'zustand'
import createSaleSlice, { SaleSlice } from './slices/saleSlice'
import createProductsSortingSlice, { ProductsSortingSlice } from './slices/productsSortingSlice'

export interface StoreState extends SaleSlice, ProductsSortingSlice {}

const useStore = create<StoreState>((set, get, api) => ({
	...createSaleSlice(set, get, api),
	...createProductsSortingSlice(set, get, api),
}))

export default useStore

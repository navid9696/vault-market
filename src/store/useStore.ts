import { create } from 'zustand'
import createSaleSlice, { SaleSlice } from './slices/saleSlice'

export interface StoreState extends SaleSlice {}

const useStore = create<StoreState>((set, get, api) => ({
	...createSaleSlice(set, get, api),
}))

export default useStore

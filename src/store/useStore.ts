import { create } from 'zustand'
import createSaleSlice, { SaleSlice } from './slices/saleSlice'

export interface StoreState extends SaleSlice {}

const useSalesStore = create<StoreState>((set, get, api) => createSaleSlice(set, get, api))

export default useSalesStore

import { StateCreator } from 'zustand'

export interface SaleSlice {
	isOnSale: boolean
	setIsOnSale: (isOnSale: boolean) => void
}

const createSaleSlice: StateCreator<SaleSlice> = set => ({
	isOnSale: true,
	setIsOnSale: isOnSale => set({ isOnSale }),
})

export default createSaleSlice

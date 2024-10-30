import { StateCreator } from 'zustand'

export interface SaleSlice {
	isDiscount: boolean
	setIsdiscount: (isDiscount: boolean) => void
}

const createSaleSlice: StateCreator<SaleSlice> = set => ({
	isDiscount: true,
	setIsdiscount: isDiscount => set({ isDiscount }),
})

export default createSaleSlice

import { StateCreator } from 'zustand'

export interface SaleSlice {
	isDiscount: boolean
	setIsDiscount: (isDiscount: boolean) => void
}

const createSaleSlice: StateCreator<SaleSlice> = set => ({
	isDiscount: true,
	setIsDiscount: isDiscount => set({ isDiscount }),
})

export default createSaleSlice

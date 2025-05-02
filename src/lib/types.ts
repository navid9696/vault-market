import { Dispatch, SetStateAction } from 'react'

export interface SettingFormsProps {
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
}

export interface OrderItem {
	id: string
	type?: string
	name: string
	quantity: number
	price: number
}

export interface Order {
	id: string
	orderDate: string
	totalAmount: number
	shippingMethod: string
	orderItems: OrderItem[]
}

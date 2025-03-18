import React, { useState } from 'react'
import { trpc } from '~/server/client'
import QuantitySelector from './QuantitySelector'
import { Button } from '@mui/material'
import { ProductCardProps } from './ProductCard'

interface CartItemType {
	product: ProductCardProps
	quantity: number
}

interface CartItemProps {
	item: CartItemType
	refetchCart: () => void
}

const CartItem = ({ item, refetchCart }: CartItemProps) => {
	const currentProduct = item.product
	const utils = trpc.useUtils()

	const updateMutation = trpc.cart.updateCartItem.useMutation({
		onSuccess: () => {
			refetchCart()
			utils.cart.getTotalItems.invalidate()
		},
	})

	const removeMutation = trpc.cart.removeCartItem.useMutation({
		onSuccess: () => {
			refetchCart()
			utils.cart.getTotalItems.invalidate()
		},
	})

	const handleQuantityChange = (newQuantity: number) => {
		const maxAvailable = currentProduct.available + item.quantity
		if (newQuantity < 1 || newQuantity > maxAvailable) return
		updateMutation.mutate({ productId: currentProduct.id, quantity: newQuantity })
	}

	const handleRemove = () => {
		removeMutation.mutate({ productId: currentProduct.id })
	}

	const displayPrice =
		currentProduct.discount > 0
			? (currentProduct.price * (1 - currentProduct.discount)).toFixed(0)
			: currentProduct.price.toFixed(0)

	return (
		<div className='border p-2 mb-2 flex items-center justify-between'>
			<div>
				<h2 className='text-lg font-bold'>{currentProduct.name}</h2>
				<p>Price: {displayPrice}</p>
			</div>
			<div className='flex items-center gap-4'>
				<QuantitySelector
					selectedQuantity={item.quantity}
					setSelectedQuantity={handleQuantityChange}
					availability={currentProduct.available}
				/>
				<Button variant='outlined' color='error' onClick={handleRemove}>
					Remove
				</Button>
			</div>
		</div>
	)
}

export default CartItem

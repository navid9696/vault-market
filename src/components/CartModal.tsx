import React from 'react'
import { trpc } from '~/server/client'
import CartItem from './CartItem'
import { CircularProgress, Typography } from '@mui/material'

const CartModal = () => {
	const { data, isLoading, error, refetch } = trpc.cart.getCartItems.useQuery()

	if (error) return <div>Error: {error.message}</div>
	if (isLoading)
		return (
			<div className='flex flex-col items-center justify-center'>
				<h2 className='mb-5'>Loading cart items...</h2>
				<CircularProgress />
			</div>
		)
	if (!data || data.length === 0) return <div>No items in cart</div>

	const totalAmount = data.reduce((sum, item) => {
		const price = item.product.discount > 0 ? item.product.price * (1 - item.product.discount) : item.product.price
		return sum + price * item.quantity
	}, 0)

	return (
		<div className='p-4'>
			{data.map(item => (
				<CartItem key={item.id} item={item} refetchCart={refetch} />
			))}
			<div className='mt-4 border-t pt-4'>
				<p>Total: ${totalAmount.toFixed(0)}</p>
			</div>
		</div>
	)
}

export default CartModal

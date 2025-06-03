import React from 'react'
import { trpc } from '~/server/client'
import CartItem from './CartItem'
import { CircularProgress, Button, Divider } from '@mui/material'
import Link from 'next/link'

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
		const price =
			item.product.discount > 0
				? Math.round(item.product.price * (1 - item.product.discount))
				: Math.round(item.product.price)
		return sum + price * item.quantity
	}, 0)

	return (
		<div className='p-2'>
			<div className='max-h-96 overflow-y-auto'>
				{data.map(item => (
					<CartItem key={item.id} product={item.product} quantity={item.quantity} refetchCart={refetch} />
				))}
			</div>
			<Divider className='mt-2' />
			<div className='pt-4 flex items-center justify-between'>
				<p className='mr-4'>Total: ${totalAmount}</p>
				<Link href='/checkout'>
					<Button variant='contained' color='primary'>
						Proceed to Checkout
					</Button>
				</Link>
			</div>
		</div>
	)
}

export default CartModal

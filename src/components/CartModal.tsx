import React from 'react'
import { trpc } from '~/server/client'
import CartItem from './CartItem'
import { CircularProgress, Button, Divider, Typography } from '@mui/material'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const CartModal = () => {
	const { status } = useSession()

	if (status === 'loading') {
		return (
			<div className='flex flex-col items-center justify-center'>
				<h2 className='mb-5'>Initializing session…</h2>
				<CircularProgress />
			</div>
		)
	}

	if (status === 'unauthenticated') {
		return (
			<div className='flex flex-col items-center justify-center p-6 text-center'>
				<Typography variant='h5' gutterBottom>
					☢️ UNAUTHORIZED ACCESS
				</Typography>
				<Typography variant='body1' paragraph>
					You must be logged in to access your Vault cart.
				</Typography>
				<Link href='/login'>
					<Button variant='contained' size='large' color='primary'>
						Login
					</Button>
				</Link>
			</div>
		)
	}

	const { data, isLoading, error, refetch } = trpc.cart.getCartItems.useQuery(undefined, {
		retry: (failureCount, err) => {
			const anyErr = err as any
			const code = anyErr?.data?.code || anyErr?.shape?.data?.code || ''
			if (String(code).toUpperCase() === 'UNAUTHORIZED') return false
			return failureCount < 2
		},
		refetchOnWindowFocus: false,
	})

	if (isLoading) {
		return (
			<div className='flex flex-col items-center justify-center'>
				<h2 className='mb-5'>Loading cart items…</h2>
				<CircularProgress />
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center p-6 text-center'>
				<Typography variant='h5' gutterBottom>
					⚠️ TERMINAL ERROR
				</Typography>
				<Typography variant='body1' paragraph>
					{error.message || 'Request failed'}
				</Typography>
				<Button variant='outlined' onClick={() => refetch()}>
					Retry
				</Button>
			</div>
		)
	}

	if (!data || data.length === 0) {
		return <div>No items in cart</div>
	}

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

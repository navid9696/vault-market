import React, { useEffect, useState, useCallback } from 'react'
import { trpc } from '~/server/client'
import CartItem from './CartItem'
import { CircularProgress, Button, Divider, Typography } from '@mui/material'
import Link from 'next/link'
import { ensureGuestId } from '~/lib/guestId'
import { useSession } from 'next-auth/react'
import CapsHint from './CapsHint'

const CartModal = () => {
	const [gid, setGid] = useState('')
	const { status } = useSession()
	useEffect(() => setGid(ensureGuestId()), [])
	const { data, isLoading, error, refetch } = trpc.cart.getCartItems.useQuery(
		{ gid },
		{ enabled: !!gid, retry: f => f < 2, refetchOnWindowFocus: false },
	)

	const { data: caps } = trpc.exchange.getCapsBalance.useQuery(undefined, { enabled: status === 'authenticated' })
	const have = status === 'authenticated' ? (caps?.balance ?? 0) : 0

	const utils = trpc.useUtils()
	const refetchCart = useCallback(async () => {
		await refetch()
		await utils.cart.getTotalItems.invalidate({ gid })
	}, [refetch, utils.cart.getTotalItems, gid])

	if (!gid || status === 'loading')
		return (
			<div className='flex flex-col items-center justify-center'>
				<h2 className='mb-5'>Initializing…</h2>
				<CircularProgress />
			</div>
		)

	if (isLoading)
		return (
			<div className='flex flex-col items-center justify-center'>
				<h2 className='mb-5'>Loading cart items…</h2>
				<CircularProgress />
			</div>
		)

	if (error)
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

	if (!data || data.length === 0) return <div>No items in cart</div>

	const totalAmount = data.reduce((sum: number, item: (typeof data)[number]) => {
		const price =
			item.product.discount > 0
				? Math.round(item.product.price * (1 - item.product.discount))
				: Math.round(item.product.price)
		return sum + price * item.quantity
	}, 0)

	const canCheckout = status === 'authenticated' && have >= totalAmount

	return (
		<div className='p-2'>
			<div className='max-h-96 overflow-y-auto'>
				{data.map((item: (typeof data)[number]) => (
					<CartItem key={item.id} product={item.product} quantity={item.quantity} refetchCart={refetchCart} />
				))}
			</div>
			<Divider className='mt-2' />
			<div className='pt-4 flex items-center justify-between'>
				<p className='pt-1 mr-4 text-lg'>Total: {totalAmount} Caps</p>

				{status !== 'authenticated' ? (
					<Link href='/login'>
						<Button variant='contained' color='primary'>
							Log In to Checkout
						</Button>
					</Link>
				) : canCheckout ? (
					<Link href='/checkout'>
						<Button variant='contained' color='primary'>
							Proceed to Checkout
						</Button>
					</Link>
				) : (
					<CapsHint need={totalAmount} />
				)}
			</div>
		</div>
	)
}

export default CartModal

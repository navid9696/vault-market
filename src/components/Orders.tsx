import React from 'react'
import OrderCard from './OrderCard'
import { Order } from '~/lib/types'
import { trpc } from '~/server/client'
import { CircularProgress } from '@mui/material'
import { useNavigationHeight } from '~/context/NavbarHeightContext'

const Orders = () => {
	const { data, isLoading, error } = trpc.orders.getOrders.useQuery()
	const orders: Order[] = data ?? []
	const { navHeight } = useNavigationHeight()

	return (
		<div style={{ marginTop: `${navHeight}px` }} className='min-h-screen bg-black text-green-200 w-full px-4'>
			<h2 className='p-8 text-center text-3xl font-bold mb-4 border-b border-green-700'>Your Orders</h2>
			<div className='flex flex-wrap justify-center items-center gap-4 w-full h-5/6 '>
				{isLoading && (
					<div className='flex justify-center mt-8'>
						<CircularProgress style={{ color: 'green' }} />
					</div>
				)}

				{error && <div className='text-red-500 text-center mt-8'>Error loading orders: {error.message}</div>}

				{(!orders || orders.length === 0) && <div className='text-center mt-8 text-green-400'>No orders found.</div>}

				{orders?.map(order => (
					<OrderCard key={order.id} order={order} />
				))}
			</div>
		</div>
	)
}

export default Orders

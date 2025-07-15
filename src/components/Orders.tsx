import React from 'react'
import OrderCard from './OrderCard'
import { Order } from '~/lib/types'
import { trpc } from '~/server/client'
import { CircularProgress } from '@mui/material'
import { useNavigationHeight } from '~/context/NavbarHeightContext'

const Orders = () => {
	const { data, isLoading, error } = trpc.orders.getOrders.useQuery()
	const orders: Order[] = data ?? []

	return (
		<div className='h-screen flex flex-col'>
			<div style={{ height: 56 }} />
			<div className='flex-1 p-4 max-w-3xl w-screen bg-bg text-text flex flex-col min-h-0'>
				<h2 className='p-8 text-center text-3xl font-bold mb-4 border-b border-border uppercase'>YOUR ORDERS</h2>

				{error && <h2 className='text-red-600'>Error: {error.message}</h2>}
				{!isLoading && orders.length === 0 && !error && <h2>No orders found.</h2>}

				{isLoading && !error && (
					<div className='flex-1 flex flex-col items-center justify-center'>
						<h2 className='mb-5'>Loading orders</h2>
						<CircularProgress />
					</div>
				)}
				<div className='flex-1 overflow-y-auto min-h-0'>
					<div className='h-full w-full flex flex-wrap gap-x-4 gap-y-2 justify-center items-start'>
						{orders?.map(order => (
							<OrderCard key={order.id} order={order} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Orders

import React from 'react'
import { trpc } from '~/server/client'
import { CircularProgress } from '@mui/material'

const Orders = () => {
	const { data: orders, isLoading, error } = trpc.orders.getOrders.useQuery()

	if (isLoading) {
		return (
			<div className='flex justify-center mt-8'>
				<CircularProgress />
			</div>
		)
	}

	if (error) {
		return <div className='text-red-500 text-center mt-8'>Error loading orders: {error.message}</div>
	}

	if (!orders || orders.length === 0) {
		return <div className='text-center mt-8 text-gray-600'>No orders found.</div>
	}

	return (
		<div className='h-dvh p-6'>
			<h2 className='text-2xl font-bold mb-4'>Your Orders</h2>
			<div className='h-full mb-8 space-y-6 overflow-y-scroll'>
				{orders.map(order => (
					<div key={order.id} className='border rounded-xl p-4 shadow-sm'>
						<div className='mb-2 text-sm text-gray-500'>Order Date: {new Date(order.orderDate).toLocaleString()}</div>
						<div className='mb-2 font-semibold'>Total Amount: {order.totalAmount} caps</div>
						<div className='text-sm text-gray-600'>Shipping Method: {order.shippingMethod}</div>
						<div className='mt-4'>
							<h4 className='font-semibold'>Items:</h4>
							<ul className='list-disc ml-5'>
								{order.orderItems.map(item => (
									<li key={item.id}>
										{item.name} × {item.quantity} — {item.price} caps
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Orders

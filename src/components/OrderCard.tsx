import React from 'react'
import { Order } from '~/lib/types'

interface OrderCardProps {
	order: Order
}

const OrderCard = ({ order }: OrderCardProps) => (
	<div className='w-80 border border-border bg-black text-text rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300'>
		<div className='mb-2 text-sm '>
			<span className='font-semibold text-primary'>Order Date:</span> {new Date(order.orderDate).toLocaleString()}
		</div>
		<div className='mb-2 text-lg font-semibold '>
			<span className='text-primary'>Total Amount:</span> {order.totalAmount} caps
		</div>
		<div className='mb-2 text-sm '>
			<span className='font-semibold text-primary'>Shipping Method:</span>
			<span className='uppercase'> {order.shippingMethod}</span>
		</div>
		<div className='mt-4'>
			<h4 className='mb-2 font-semibold text-primary'>Items:</h4>
			<ul className='list-disc ml-5 space-y-1 text-sm text-text'>
				{order.orderItems.map(item => (
					<li key={item.id}>
						{item.name} × {item.quantity} — {item.price} caps
					</li>
				))}
			</ul>
		</div>
	</div>
)

export default OrderCard

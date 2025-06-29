'use client'
import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '~/server/client'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Pagination,
	Stack,
	Button,
} from '@mui/material'

const UserOrdersDetails = ({ userId }: { userId: string }) => {
	const [page, setPage] = useState(1)
	const limit = 10
	const { data, isLoading } = trpc.orders.getOrdersByUser.useQuery({ userId, page, limit })
	if (isLoading) return <p>Loading...</p>
	const orders = data?.orders ?? []
	const total = data?.total ?? 0
	const pageCount = Math.ceil(total / limit)

	const formatAddress = (order: (typeof orders)[number]) =>
		`${order.street}${order.addressOptional ? ` ${order.addressOptional}` : ''}, ${order.city}, ${order.state} ${
			order.zipCode
		}`

	return (
		<div>
			<Button component={Link} href='/admin/users' variant='contained' color='primary' size='small' sx={{ mb: 2 }}>
				← Back to Users
			</Button>
			<TableContainer component={Paper} className='rounded-lg shadow-md'>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Order Date & Time</TableCell>
							<TableCell>Shipping Method</TableCell>
							<TableCell>Address</TableCell>
							<TableCell>Items</TableCell>
							<TableCell>Total Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map(order => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
								<TableCell>{order.shippingMethod}</TableCell>
								<TableCell>{formatAddress(order)}</TableCell>
								<TableCell>
									<ul className='list-disc ml-5 space-y-1 text-sm divide-y divide-gray-300'>
										{(order.orderItems ?? []).map(item => (
											<li key={item.id} className='py-2'>
												{item.name} × {item.quantity} — {item.price} caps
											</li>
										))}
									</ul>
								</TableCell>
								<TableCell>{order.totalAmount.toFixed(0)} caps</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Stack spacing={2} alignItems='center' className='mt-4'>
				<Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} />
			</Stack>
		</div>
	)
}

export default UserOrdersDetails

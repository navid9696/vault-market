'use client'
import { useState } from 'react'
import { trpc } from '~/server/client'
import Link from 'next/link'
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

const UserCapsDetails = ({ userId }: { userId: string }) => {
	const [page, setPage] = useState(1)
	const limit = 10
	const { data, isLoading } = trpc.exchange.getCapsOrdersByUser.useQuery({ userId, page, limit })
	if (isLoading) return <p>Loading...</p>
	const orders = data?.orders ?? []
	const total = data?.total ?? 0
	const pageCount = Math.ceil(total / limit)

	return (
		<>
			<Button component={Link} href='/admin/users' variant='contained' color='primary' size='small' sx={{ mb: 2 }}>
				← Back to Users
			</Button>
			<TableContainer component={Paper} className='rounded-lg shadow-md'>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Quantity</TableCell>
							<TableCell>USD Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map(order => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.quantity}</TableCell>
								<TableCell>${order.usdValue.toFixed(2)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Stack spacing={2} alignItems='center' className='mt-4'>
				<Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} />
			</Stack>
		</>
	)
}

export default UserCapsDetails

'use client'
import { trpc } from '~/server/client'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useEffect } from 'react'

type Props = {
	userId: string
}

const UserCapsDetails = ({ userId }: Props) => {
	useEffect(() => {
		console.log('💡 UserCapsDetails got prop userId =', userId)
	}, [userId])
	const { data, isLoading } = trpc.exchange.getCapsOrdersByUser.useQuery({ userId })
	useEffect(() => {
		console.log('💡 trpc.exchange.getCapsOrdersByUser called with input =', { userId })
	}, [userId])
	if (isLoading) return <p>Loading...</p>

	return (
		<div>
			<Link href='/admin/dashboard' className='text-sm text-blue-600 hover:underline mb-4 inline-block'>
				← Back to Dashboard
			</Link>
			<TableContainer component={Paper} className='rounded-lg shadow-md'>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Quantity</TableCell>
							<TableCell>USD Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map(order => (
							<TableRow key={order.id}>
								<TableCell>{order.quantity}</TableCell>
								<TableCell>${order.usdValue.toFixed(2)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default UserCapsDetails

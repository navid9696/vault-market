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
	Skeleton,
} from '@mui/material'

type Address = {
	street: string
	addressOptional: string | null
	city: string
	state: string
	zipCode: string
}

const AdminUsersTable = () => {
	const [page, setPage] = useState(1)
	const limit = 10
	const { data, isLoading } = trpc.user.getAllUsers.useQuery({ page, limit })
	if (isLoading) {
		return (
			<TableContainer component={Paper} className='rounded-lg shadow-md'>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Address</TableCell>
							<TableCell>Caps Orders</TableCell>
							<TableCell>Product Orders</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Array.from({ length: limit }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton width={200} />
								</TableCell>
								<TableCell>
									<Skeleton width={100} />
								</TableCell>
								<TableCell>
									<Skeleton width={200} />
								</TableCell>
								<TableCell>
									<Skeleton width={100} />
								</TableCell>
								<TableCell>
									<Skeleton width={100} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		)
	}

	const users = data?.users ?? []
	const total = data?.total ?? 0
	const pageCount = Math.ceil(total / limit)

	const formatAddress = (addr: Address) =>
		`${addr.street}${addr.addressOptional ? ` ${addr.addressOptional}` : ''}, ${addr.city}, ${addr.state} ${
			addr.zipCode
		}`

	return (
		<TableContainer component={Paper} className='rounded-lg shadow-md'>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Address</TableCell>
						<TableCell>Caps Orders</TableCell>
						<TableCell>Product Orders</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map((u: typeof users[number]) => (
						<TableRow key={u.id}>
							<TableCell>{u.id}</TableCell>
							<TableCell>{u.email}</TableCell>
							<TableCell>{u.address ? formatAddress(u.address) : 'No address provided'}</TableCell>
							<TableCell>
								<Link href={`/admin/users/${u.id}/capsOrders`} passHref>
									<Button variant='contained' size='small'>
										Caps Orders
									</Button>
								</Link>
							</TableCell>
							<TableCell>
								<Link href={`/admin/users/${u.id}/orders`} passHref>
									<Button variant='contained' size='small'>
										Product Orders
									</Button>
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Stack spacing={2} alignItems='center' className='mt-4 mb-4'>
				<Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} />
			</Stack>
		</TableContainer>
	)
}

export default AdminUsersTable

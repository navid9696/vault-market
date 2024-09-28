'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'

interface CreateDataProps {
	id: number
	username: string
	email: string
	amount: number
	date: string
}

function createData({ id, username, email, amount, date }: CreateDataProps) {
	return { id, username, email, amount, date }
}

const rows: CreateDataProps[] = [
	createData({ id: 1, username: 'JohnDoe', email: 'john@example.com', amount: 100, date: '2024-01-01' }),
	createData({ id: 2, username: 'JaneSmith', email: 'jane@example.com', amount: 150, date: '2024-01-02' }),
	createData({ id: 3, username: 'SamBrown', email: 'sam@example.com', amount: 200, date: '2024-01-03' }),
	createData({ id: 4, username: 'JohnDoe', email: 'john@example.com', amount: 100, date: '2024-01-01' }),
	createData({ id: 5, username: 'JaneSmith', email: 'jane@example.com', amount: 150, date: '2024-01-02' }),
	createData({ id: 6, username: 'SamBrown', email: 'sam@example.com', amount: 200, date: '2024-01-03' }),
	createData({ id: 7, username: 'JohnDoe', email: 'john@example.com', amount: 100, date: '2024-01-01' }),
	createData({ id: 8, username: 'JaneSmith', email: 'jane@example.com', amount: 150, date: '2024-01-02' }),
	createData({ id: 9, username: 'SamBrown', email: 'sam@example.com', amount: 200, date: '2024-01-03' }),
	createData({ id: 10, username: 'JohnDoe', email: 'john@example.com', amount: 100, date: '2024-01-01' }),
	createData({ id: 11, username: 'JaneSmith', email: 'jane@example.com', amount: 150, date: '2024-01-02' }),
	createData({ id: 12, username: 'SamBrown', email: 'sam@example.com', amount: 200, date: '2024-01-03' }),
	createData({ id: 13, username: 'JohnDoe', email: 'john@example.com', amount: 100, date: '2024-01-01' }),
	createData({ id: 14, username: 'JaneSmith', email: 'jane@example.com', amount: 150, date: '2024-01-02' }),
	createData({ id: 15, username: 'SamBrown', email: 'sam@example.com', amount: 200, date: '2024-01-03' }),
]

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) return order
		return a[1] - b[1]
	})
	return stabilizedThis.map(el => el[0])
}

type Order = 'asc' | 'desc'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy)
}

function Dashboard() {
	const [searchId, setSearchId] = React.useState('')
	const [order, setOrder] = React.useState<Order>('asc')
	const [orderBy, setOrderBy] = React.useState<keyof CreateDataProps>('id')
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(5)

	const handleRequestSort = (property: keyof CreateDataProps) => {
		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

	const handleChangePage = (e: unknown, newPage: number) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(e.target.value, 10))
		setPage(0)
	}

	const filteredRows = searchId ? rows.filter(row => row.id.toString() === searchId) : rows

	const visibleRows = React.useMemo(
		() =>
			stableSort(filteredRows, getComparator(order, orderBy)).slice(
				page * rowsPerPage,
				page * rowsPerPage + rowsPerPage
			),
		[order, orderBy, page, rowsPerPage, filteredRows]
	)

	return (
		<div className='w-full'>
			<div className='max-w-7xl mx-auto p-2'>
				<div className='grid sm:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4'>
					<div className='bg-white p-2 sm:p-4 rounded-lg shadow'>
						<h2 className='sm:text-center text-xl font-bold'>Total Income</h2>
						<p className='sm:text-center text-lg'>$1,000</p>
					</div>
					<div className='bg-white p-2 sm:p-4 rounded-lg shadow'>
						<h2 className='sm:text-center text-xl font-bold'>Total Orders</h2>
						<p className='sm:text-center text-lg'>150</p>
					</div>
					<div className='bg-white p-2 sm:p-4 rounded-lg shadow'>
						<h2 className='sm:text-center text-xl font-bold'>Total Users</h2>
						<p className='sm:text-center text-lg'>300</p>
					</div>
				</div>
				<div className='bg-white p-4 rounded-lg shadow-md'>
					<h2 className='text-2xl font-bold mb-4'>Orders</h2>
					<div className='flex mb-4'>
						<TextField
							variant='outlined'
							label='Find ID'
							value={searchId}
							onChange={e => setSearchId(e.target.value)}
							className='flex-1'
						/>
						<Button variant='contained' color='primary' onClick={() => console.log('Searching for ID:', searchId)}>
							Find ID
						</Button>
					</div>
					<TableContainer component={Paper}>
						<Table size='small' aria-label='a dense table'>
							<TableHead>
								<TableRow>
									<TableCell>
										<TableSortLabel
											active={orderBy === 'id'}
											direction={orderBy === 'id' ? order : 'asc'}
											onClick={() => handleRequestSort('id')}>
											ID
											{orderBy === 'id' ? (
												<Box component='span' sx={visuallyHidden}>
													{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
												</Box>
											) : null}
										</TableSortLabel>
									</TableCell>
									<TableCell align='left'>
										<TableSortLabel
											active={orderBy === 'username'}
											direction={orderBy === 'username' ? order : 'asc'}
											onClick={() => handleRequestSort('username')}>
											Username
											{orderBy === 'username' ? (
												<Box component='span' sx={visuallyHidden}>
													{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
												</Box>
											) : null}
										</TableSortLabel>
									</TableCell>
									<TableCell align='left'>
										<TableSortLabel
											active={orderBy === 'email'}
											direction={orderBy === 'email' ? order : 'asc'}
											onClick={() => handleRequestSort('email')}>
											Email
											{orderBy === 'email' ? (
												<Box component='span' sx={visuallyHidden}>
													{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
												</Box>
											) : null}
										</TableSortLabel>
									</TableCell>
									<TableCell align='right'>
										<TableSortLabel
											active={orderBy === 'amount'}
											direction={orderBy === 'amount' ? order : 'asc'}
											onClick={() => handleRequestSort('amount')}>
											$
											{orderBy === 'amount' ? (
												<Box component='span' sx={visuallyHidden}>
													{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
												</Box>
											) : null}
										</TableSortLabel>
									</TableCell>
									<TableCell align='left'>
										<TableSortLabel
											active={orderBy === 'date'}
											direction={orderBy === 'date' ? order : 'asc'}
											onClick={() => handleRequestSort('date')}>
											Date
											{orderBy === 'date' ? (
												<Box component='span' sx={visuallyHidden}>
													{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
												</Box>
											) : null}
										</TableSortLabel>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{visibleRows.map((row: CreateDataProps) => {
									return (
										<TableRow key={row.id}>
											<TableCell component='th' scope='row'>
												{row.id}
											</TableCell>
											<TableCell align='left'>{row.username}</TableCell>
											<TableCell align='left'>{row.email}</TableCell>
											<TableCell align='right'>{row.amount}</TableCell>
											<TableCell align='left'>{row.date}</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component='div'
						count={filteredRows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</div>
			</div>
		</div>
	)
}

export default Dashboard

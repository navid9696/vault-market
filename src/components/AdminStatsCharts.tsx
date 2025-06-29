'use client'
import { useState } from 'react'
import { trpc } from '~/server/client'
import { Box, Grid, Card, CardContent, Typography, ToggleButtonGroup, ToggleButton, Skeleton } from '@mui/material'
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	Legend,
} from 'recharts'

type Period = '7' | '30' | '12m'
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EF9', '#F95A8E']

const formatDate = (s: string, period: Period) => {
	const d = new Date(s)
	if (period === '12m') {
		return d.toLocaleString('default', { month: 'short' })
	}
	const mm = String(d.getMonth() + 1).padStart(2, '0')
	const dd = String(d.getDate()).padStart(2, '0')
	return `${mm}-${dd}`
}

const AdminStatsCharts = () => {
	const [period, setPeriod] = useState<Period>('7')
	const { data: stats, isLoading: statsLoading } = trpc.admin.getGlobalStats.useQuery()

	const regs7 = trpc.admin.getRegistrationsLast7Days.useQuery()
	const caps7 = trpc.admin.getCapsOrdersLast7Days.useQuery()
	const prod7 = trpc.admin.getOrdersLast7Days.useQuery()
	const rev7 = trpc.admin.getCapsRevenueLast7Days.useQuery()
	const ship7 = trpc.admin.getShippingMethodDistributionLast7Days.useQuery()

	const regs30 = trpc.admin.getRegistrationsLast30Days.useQuery()
	const caps30 = trpc.admin.getCapsOrdersLast30Days.useQuery()
	const prod30 = trpc.admin.getOrdersLast30Days.useQuery()
	const rev30 = trpc.admin.getCapsRevenueLast30Days.useQuery()
	const ship30 = trpc.admin.getShippingMethodDistributionLast30Days.useQuery()

	const regs12m = trpc.admin.getRegistrationsLast12Months.useQuery()
	const caps12m = trpc.admin.getCapsOrdersLast12Months.useQuery()
	const prod12m = trpc.admin.getOrdersLast12Months.useQuery()
	const rev12m = trpc.admin.getCapsRevenueLast12Months.useQuery()
	const ship12m = trpc.admin.getShippingMethodDistributionLast12Months.useQuery()

	const loading =
		statsLoading ||
		(period === '7'
			? regs7.isLoading || caps7.isLoading || prod7.isLoading || rev7.isLoading || ship7.isLoading
			: period === '30'
			? regs30.isLoading || caps30.isLoading || prod30.isLoading || rev30.isLoading || ship30.isLoading
			: regs12m.isLoading || caps12m.isLoading || prod12m.isLoading || rev12m.isLoading || ship12m.isLoading)

	if (loading || !stats) {
		return (
			<Box p={3}>
				<Grid container spacing={2} mb={3}>
					{Array.from({ length: 4 }).map((_, i) => (
						<Grid item xs={12} sm={6} md={4} key={i}>
							<Skeleton variant='rectangular' height={80} />
						</Grid>
					))}
				</Grid>

				<Box mb={3}>
					<Skeleton variant='rectangular' width={240} height={36} />
				</Box>

				<Grid container spacing={4}>
					{Array.from({ length: 5 }).map((_, i) => (
						<Grid item xs={12} sm={6} md={4} key={i}>
							<Skeleton variant='rectangular' width='100%' height={250} />
						</Grid>
					))}
				</Grid>
			</Box>
		)
	}

	const registrations = period === '7' ? regs7.data! : period === '30' ? regs30.data! : regs12m.data!

	const capsOrders = period === '7' ? caps7.data! : period === '30' ? caps30.data! : caps12m.data!

	const prodOrders = period === '7' ? prod7.data! : period === '30' ? prod30.data! : prod12m.data!

	const income = period === '7' ? rev7.data! : period === '30' ? rev30.data! : rev12m.data!

	const shippingData = period === '7' ? ship7.data! : period === '30' ? ship30.data! : ship12m.data!

	return (
		<Box p={3}>
			<Grid container spacing={2} mb={3}>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography>Total Users</Typography>
							<Typography variant='h5'>{stats.totalUsers}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography>Total Caps Orders</Typography>
							<Typography variant='h5'>{stats.capsOrderCount}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography>Total Product Orders</Typography>
							<Typography variant='h5'>{stats.productOrderCount}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography>Total Income (USD)</Typography>
							<Typography variant='h5'>${stats.capsRevenueUsd.toFixed(2)}</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<ToggleButtonGroup
				value={period}
				exclusive
				onChange={(_, v) => (['7', '30', '12m'] as Period[]).includes(v as Period) && setPeriod(v as Period)}
				sx={{ mb: 3 }}>
				<ToggleButton value='7'>Last 7 Days</ToggleButton>
				<ToggleButton value='30'>Last 30 Days</ToggleButton>
				<ToggleButton value='12m'>Last Year</ToggleButton>
			</ToggleButtonGroup>

			<Grid container spacing={4}>
				<Grid item xs={12} md={4} height={250}>
					<Typography mb={1}>Registrations</Typography>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart data={registrations}>
							<XAxis dataKey={period === '12m' ? 'month' : 'date'} tickFormatter={s => formatDate(s, period)} />
							<YAxis />
							<CartesianGrid strokeDasharray='3 3' />
							<Tooltip labelFormatter={s => formatDate(s as string, period)} />
							<Line type='monotone' dataKey='count' name='Registrations' stroke='#8884d8' />
						</LineChart>
					</ResponsiveContainer>
				</Grid>
				<Grid item xs={12} md={4} height={250}>
					<Typography mb={1}>Caps Orders</Typography>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart data={capsOrders}>
							<XAxis dataKey={period === '12m' ? 'month' : 'date'} tickFormatter={s => formatDate(s, period)} />
							<YAxis />
							<CartesianGrid strokeDasharray='3 3' />
							<Tooltip labelFormatter={s => formatDate(s as string, period)} />
							<Bar dataKey='count' name='Caps Orders' fill='#82ca9d' />
						</BarChart>
					</ResponsiveContainer>
				</Grid>
				<Grid item xs={12} md={4} height={250}>
					<Typography mb={1}>Product Orders</Typography>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart data={prodOrders}>
							<XAxis dataKey={period === '12m' ? 'month' : 'date'} tickFormatter={s => formatDate(s, period)} />
							<YAxis />
							<CartesianGrid strokeDasharray='3 3' />
							<Tooltip labelFormatter={s => formatDate(s as string, period)} />
							<Bar dataKey='count' name='Product Orders' fill='#8884d8' />
						</BarChart>
					</ResponsiveContainer>
				</Grid>
				<Grid item xs={12} md={4} height={250}>
					<Typography mb={1}>Income (USD)</Typography>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart data={income}>
							<XAxis dataKey={period === '12m' ? 'month' : 'date'} tickFormatter={s => formatDate(s, period)} />
							<YAxis />
							<CartesianGrid strokeDasharray='3 3' />
							<Tooltip
								labelFormatter={s => formatDate(s as string, period)}
								formatter={(value: number) => value.toFixed(2)}
							/>
							<Line type='monotone' dataKey='value' name='Income' stroke='#ff7300' />
						</LineChart>
					</ResponsiveContainer>
				</Grid>
				<Grid item xs={12} md={4} height={285}>
					<Typography mb={1}>Shipping Methods</Typography>
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart>
							<Pie data={shippingData} dataKey='count' nameKey='method' outerRadius={80} label>
								{shippingData.map((_, idx) => (
									<Cell key={idx} fill={COLORS[idx % COLORS.length]} />
								))}
							</Pie>
							<Tooltip formatter={(value: number) => value.toString()} />
							<Legend verticalAlign='bottom' height={36} />
						</PieChart>
					</ResponsiveContainer>
				</Grid>
			</Grid>
		</Box>
	)
}

export default AdminStatsCharts

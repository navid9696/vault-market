import { router, procedure } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const adminRouter = router({
	getGlobalStats: procedure.query(async () => {
		const totalUsers = await prisma.user.count()
		const capsOrderCount = await prisma.capsOrder.count()
		const productOrderCount = await prisma.userOrders.count()
		const capsAgg = await prisma.capsOrder.aggregate({ _sum: { usdValue: true } })
		return {
			totalUsers,
			capsOrderCount,
			productOrderCount,
			capsRevenueUsd: capsAgg._sum.usdValue ?? 0,
		}
	}),

	getRegistrationsLast7Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 6)
		const users = await prisma.user.findMany({
			where: { createdAt: { gte: start } },
			select: { createdAt: true },
		})
		const counts: Record<string, number> = {}
		users.forEach(({ createdAt }) => {
			const day = createdAt.toISOString().slice(0, 10)
			counts[day] = (counts[day] || 0) + 1
		})
		return Array.from({ length: 7 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, count: counts[day] ?? 0 }
		})
	}),

	getOrdersLast7Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 6)
		const orders = await prisma.userOrders.findMany({
			where: { orderDate: { gte: start } },
			select: { orderDate: true },
		})
		const counts: Record<string, number> = {}
		orders.forEach(({ orderDate }) => {
			const day = orderDate.toISOString().slice(0, 10)
			counts[day] = (counts[day] || 0) + 1
		})
		return Array.from({ length: 7 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, count: counts[day] ?? 0 }
		})
	}),

	getCapsOrdersLast7Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 6)
		const caps = await prisma.capsOrder.findMany({
			where: { createdAt: { gte: start } },
			select: { createdAt: true },
		})
		const counts: Record<string, number> = {}
		caps.forEach(({ createdAt }) => {
			const day = createdAt.toISOString().slice(0, 10)
			counts[day] = (counts[day] || 0) + 1
		})
		return Array.from({ length: 7 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, count: counts[day] ?? 0 }
		})
	}),

	getCapsRevenueLast7Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 6)
		const caps = await prisma.capsOrder.findMany({
			where: { createdAt: { gte: start } },
			select: { createdAt: true, usdValue: true },
		})
		const sums: Record<string, number> = {}
		caps.forEach(({ createdAt, usdValue }) => {
			const day = createdAt.toISOString().slice(0, 10)
			sums[day] = (sums[day] || 0) + usdValue
		})
		return Array.from({ length: 7 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, value: sums[day] ?? 0 }
		})
	}),

	getRegistrationsLast30Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 29)
		const users = await prisma.user.findMany({
			where: { createdAt: { gte: start } },
			select: { createdAt: true },
		})
		const counts: Record<string, number> = {}
		users.forEach(({ createdAt }) => {
			const day = createdAt.toISOString().slice(0, 10)
			counts[day] = (counts[day] || 0) + 1
		})
		return Array.from({ length: 30 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, count: counts[day] ?? 0 }
		})
	}),

	getOrdersLast30Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 29)
		const orders = await prisma.userOrders.findMany({
			where: { orderDate: { gte: start } },
			select: { orderDate: true },
		})
		const counts: Record<string, number> = {}
		orders.forEach(({ orderDate }) => {
			const day = orderDate.toISOString().slice(0, 10)
			counts[day] = (counts[day] || 0) + 1
		})
		return Array.from({ length: 30 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, count: counts[day] ?? 0 }
		})
	}),

	getCapsOrdersLast30Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 29)
		const caps = await prisma.capsOrder.findMany({
			where: { createdAt: { gte: start } },
			select: { createdAt: true },
		})
		const counts: Record<string, number> = {}
		caps.forEach(({ createdAt }) => {
			const day = createdAt.toISOString().slice(0, 10)
			counts[day] = (counts[day] || 0) + 1
		})
		return Array.from({ length: 30 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, count: counts[day] ?? 0 }
		})
	}),

	getCapsRevenueLast30Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 29)
		const caps = await prisma.capsOrder.findMany({
			where: { createdAt: { gte: start } },
			select: { createdAt: true, usdValue: true },
		})
		const sums: Record<string, number> = {}
		caps.forEach(({ createdAt, usdValue }) => {
			const day = createdAt.toISOString().slice(0, 10)
			sums[day] = (sums[day] || 0) + usdValue
		})
		return Array.from({ length: 30 }).map((_, i) => {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const day = d.toISOString().slice(0, 10)
			return { date: day, value: sums[day] ?? 0 }
		})
	}),

	getRegistrationsLast12Months: procedure.query(async () => {
		const today = new Date()
		const startYear = today.getFullYear()
		const startMonth = today.getMonth() - 11
		const startDate = new Date(startYear, startMonth, 1)
		const users = await prisma.user.findMany({
			where: { createdAt: { gte: startDate } },
			select: { createdAt: true },
		})
		const counts: Record<string, number> = {}
		users.forEach(({ createdAt }) => {
			const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
			counts[key] = (counts[key] || 0) + 1
		})
		return Array.from({ length: 12 }).map((_, i) => {
			const d = new Date(startYear, startMonth + i, 1)
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
			return { month: key, count: counts[key] ?? 0 }
		})
	}),

	getOrdersLast12Months: procedure.query(async () => {
		const today = new Date()
		const startYear = today.getFullYear()
		const startMonth = today.getMonth() - 11
		const startDate = new Date(startYear, startMonth, 1)
		const orders = await prisma.userOrders.findMany({
			where: { orderDate: { gte: startDate } },
			select: { orderDate: true },
		})
		const counts: Record<string, number> = {}
		orders.forEach(({ orderDate }) => {
			const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`
			counts[key] = (counts[key] || 0) + 1
		})
		return Array.from({ length: 12 }).map((_, i) => {
			const d = new Date(startYear, startMonth + i, 1)
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
			return { month: key, count: counts[key] ?? 0 }
		})
	}),

	getCapsOrdersLast12Months: procedure.query(async () => {
		const today = new Date()
		const startYear = today.getFullYear()
		const startMonth = today.getMonth() - 11
		const startDate = new Date(startYear, startMonth, 1)
		const caps = await prisma.capsOrder.findMany({
			where: { createdAt: { gte: startDate } },
			select: { createdAt: true },
		})
		const counts: Record<string, number> = {}
		caps.forEach(({ createdAt }) => {
			const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
			counts[key] = (counts[key] || 0) + 1
		})
		return Array.from({ length: 12 }).map((_, i) => {
			const d = new Date(startYear, startMonth + i, 1)
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
			return { month: key, count: counts[key] ?? 0 }
		})
	}),

	getCapsRevenueLast12Months: procedure.query(async () => {
		const today = new Date()
		const startYear = today.getFullYear()
		const startMonth = today.getMonth() - 11
		const startDate = new Date(startYear, startMonth, 1)
		const caps = await prisma.capsOrder.findMany({
			where: { createdAt: { gte: startDate } },
			select: { createdAt: true, usdValue: true },
		})
		const sums: Record<string, number> = {}
		caps.forEach(({ createdAt, usdValue }) => {
			const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
			sums[key] = (sums[key] || 0) + usdValue
		})
		return Array.from({ length: 12 }).map((_, i) => {
			const d = new Date(startYear, startMonth + i, 1)
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
			return { month: key, value: sums[key] ?? 0 }
		})
	}),
	getShippingMethodDistributionLast7Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 6)
		const orders = await prisma.userOrders.findMany({
			where: { orderDate: { gte: start } },
			select: { shippingMethod: true },
		})
		const counts: Record<string, number> = {}
		orders.forEach(({ shippingMethod }) => {
			counts[shippingMethod] = (counts[shippingMethod] || 0) + 1
		})
		return Object.entries(counts).map(([method, count]) => ({ method, count }))
	}),

	getShippingMethodDistributionLast30Days: procedure.query(async () => {
		const today = new Date()
		const start = new Date(today)
		start.setDate(today.getDate() - 29)
		const orders = await prisma.userOrders.findMany({
			where: { orderDate: { gte: start } },
			select: { shippingMethod: true },
		})
		const counts: Record<string, number> = {}
		orders.forEach(({ shippingMethod }) => {
			counts[shippingMethod] = (counts[shippingMethod] || 0) + 1
		})
		return Object.entries(counts).map(([method, count]) => ({ method, count }))
	}),

	getShippingMethodDistributionLast12Months: procedure.query(async () => {
		const today = new Date()
		const startYear = today.getFullYear()
		const startMonth = today.getMonth() - 11
		const startDate = new Date(startYear, startMonth, 1)
		const orders = await prisma.userOrders.findMany({
			where: { orderDate: { gte: startDate } },
			select: { shippingMethod: true },
		})
		const counts: Record<string, number> = {}
		orders.forEach(({ shippingMethod }) => {
			counts[shippingMethod] = (counts[shippingMethod] || 0) + 1
		})
		return Object.entries(counts).map(([method, count]) => ({ method, count }))
	}),
})

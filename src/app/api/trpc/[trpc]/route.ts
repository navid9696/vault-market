import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/server'

export async function GET(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => ({}),
	})
}

export async function POST(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => ({}),
	})
}

export async function PUT(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => ({}),
	})
}

export async function DELETE(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => ({}),
	})
}

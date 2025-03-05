import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from '~/context/sessionsContext'
import { appRouter } from '~/server'

export async function GET(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

export async function POST(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

export async function PUT(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

export async function DELETE(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

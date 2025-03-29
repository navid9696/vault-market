import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'
import { createContext } from '~/context/sessionsContext'
import { appRouter } from '~/server'

export async function GET(req: NextRequest) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

export async function POST(req: NextRequest) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

export async function PUT(req: NextRequest) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

export async function DELETE(req: NextRequest) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

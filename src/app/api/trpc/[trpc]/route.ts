import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'
import { appRouter } from '~/server'
import { createContext } from '~/context/sessionsContext'

const handler = async (req: NextRequest) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: () => createContext(req),
	})
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }

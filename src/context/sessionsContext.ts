// src/context/sessionsContext.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '~/lib/authOptions'

export async function createContext(_req: Request) {
	const session = await getServerSession(authOptions)
	console.log('Session in context:', session)
	return { session }
}

export type Context = Awaited<ReturnType<typeof createContext>>

import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function createContext(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
	return { session: token }
}

export type Context = Awaited<ReturnType<typeof createContext>>

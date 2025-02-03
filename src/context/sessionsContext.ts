import { getServerSession } from 'next-auth/next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '~/app/api/auth/[...nextauth]/route';


export const createContext = async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
	const session = await getServerSession(req, res, authOptions)
	return { req, res, session }
}

export type Context = Awaited<ReturnType<typeof createContext>>

import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string
			provider?: string
			role: 'ADMIN' | 'USER'
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string
		provider?: string
		role: 'ADMIN' | 'USER'
	}
}

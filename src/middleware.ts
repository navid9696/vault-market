import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
	const { pathname } = req.nextUrl

	if (pathname.startsWith('/admin')) {
		if (!token || token.email !== 'admin@admin.admin') {
			const url = req.nextUrl.clone()
			url.pathname = '/'
			return NextResponse.redirect(url)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/admin/:path*'],
}

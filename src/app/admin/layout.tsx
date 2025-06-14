import type { Metadata } from 'next'
import { Inter, Share_Tech_Mono } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@mui/material'
import theme from '~/lib/theme'
import { TrpcProvider } from '~/providers/TrpcProvider'
import AdminNavbar from '~/components/AdminNavbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Admin Panel',
	description: '',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	{
		return (
			<html className='scrollbar-hide scroll-smooth' lang='en'>
				<body className={`admin ${inter.className} bg-zinc-900`}>
					<TrpcProvider>
						<div className='h-screen flex flex-col'>
							<AdminNavbar />
							{children}
						</div>
					</TrpcProvider>
				</body>
			</html>
		)
	}
}

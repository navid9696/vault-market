import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AdminNavbar from '~/components/AdminNavbar'
import { TrpcProvider } from '~/providers/TrpcProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Admin Panel',
	description: '',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	{
		return (
			<html className='scrollbar-hide scroll-smooth' lang='en'>
				<body className={`admin ${inter.className} bg-white`}>
					<TrpcProvider>
						<div className='flex flex-col'>
							<AdminNavbar />
							{children}
						</div>
					</TrpcProvider>
				</body>
			</html>
		)
	}
}

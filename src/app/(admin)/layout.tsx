import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AdminNavbar from '~/components/AdminNavbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Admin Panel',
	description: '',
}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html className='scrollbar-hide scroll-smooth' lang='en'>
			<body className={`admin ${inter.className} bg-zinc-900`}>
				<AdminNavbar />
				{children}
			</body>
		</html>
	)
}
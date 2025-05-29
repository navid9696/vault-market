import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@mui/material'
import theme from '~/lib/theme'
import { TrpcProvider } from '~/providers/TrpcProvider'
import ThemeRegistry from '~/providers/ThemeRegistry'

const shareTechMono = Share_Tech_Mono({
	subsets: ['latin'],
	variable: '--share-tech-mono',
	weight: '400',
})

export const metadata: Metadata = {
	title: 'Auth',
	description: '',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html className='scrollbar-hide scroll-smooth' lang='en'>
			<body
				id='top'
				className={`user ${shareTechMono.variable} ${shareTechMono.className} overflow-x-hidden bg-zinc-950`}>
				<TrpcProvider>
					<ThemeRegistry>{children}</ThemeRegistry>
				</TrpcProvider>
			</body>
		</html>
	)
}

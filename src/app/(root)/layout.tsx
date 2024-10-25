import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import '../globals.css'

const shareTechMono = Share_Tech_Mono({
	subsets: ['latin'],
	weight: '400',
})

export const metadata: Metadata = {
	title: 'Vault Market',
	description: '',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html className='scrollbar-hide scroll-smooth' lang='en'>
			<body id='top' className={`${shareTechMono.className} overflow-x-hidden bg-zinc-950`}>
				{children}
			</body>
		</html>
	)
}

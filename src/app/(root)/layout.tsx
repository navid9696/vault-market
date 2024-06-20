import type { Metadata } from 'next'

import { Roboto_Mono, Share_Tech_Mono, VT323 } from 'next/font/google'
import '../globals.css'
import { ApolloWrapper } from '@/providers/ApolloWrapper'

const shareTechMono = Share_Tech_Mono({
	subsets: ['latin'],
	weight: '400',
})
const vt323 = VT323({
	subsets: ['latin'],
	weight: '400',
})
// const robotoMono = Roboto_Mono({ subsets: ['latin'] })

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
		<html lang='en'>
			<body className={`${shareTechMono.className} bg-zinc-950`}>
				{/* Apollo for future implementation */}
				<ApolloWrapper>{children}</ApolloWrapper>
			</body>
		</html>
	)
}
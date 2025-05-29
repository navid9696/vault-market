// app/layout.tsx
import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import '../globals.css'
import { TrpcProvider } from '~/providers/TrpcProvider'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import ThemeRegistry from '~/providers/ThemeRegistry'

const shareTechMono = Share_Tech_Mono({
	subsets: ['latin'],
	variable: '--share-tech-mono',
	weight: '400',
})

export const metadata: Metadata = {
	title: 'Vault Market',
	description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className='scrollbar-hide scroll-smooth'>
			<body
				id='top'
				className={`
          user
          ${shareTechMono.variable}
          ${shareTechMono.className}
          overflow-x-hidden
          bg-bg
          text-text
        `}>
				<TrpcProvider>
					<NextThemesProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem={false}
						disableTransitionOnChange
						enableColorScheme={false}>
						<ThemeRegistry>{children}</ThemeRegistry>
					</NextThemesProvider>
				</TrpcProvider>
			</body>
		</html>
	)
}

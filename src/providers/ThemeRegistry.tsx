'use client'
import { useState, useEffect, useMemo } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'
import { ThemeProvider as MUIThemeProvider } from '@mui/material'
import theme from '~/lib/theme'

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	const { resolvedTheme } = useNextTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const mode = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'
	const muiTheme = useMemo(() => theme(mode), [mode])

	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='light'
			enableSystem={false}
			disableTransitionOnChange
			enableColorScheme={false}>
			<MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>
		</NextThemesProvider>
	)
}

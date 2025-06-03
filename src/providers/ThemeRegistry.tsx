// src/providers/ThemeRegistry.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import theme from '~/lib/theme'

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	const { resolvedTheme } = useNextTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const mode = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'
	const muiTheme = useMemo(() => theme(mode), [mode])

	return <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>
}

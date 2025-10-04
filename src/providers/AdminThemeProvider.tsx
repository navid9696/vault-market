'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme, type PaletteMode } from '@mui/material'

type Ctx = { mode: PaletteMode; toggle: () => void }
const AdminThemeCtx = createContext<Ctx | null>(null)

const buildTheme = (mode: PaletteMode) =>
	createTheme({
		palette: {
			mode,
			background: {
				default: mode === 'dark' ? '#121212' : '#fafafa',
				paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
			},
			primary: { main: mode === 'dark' ? '#bb86fc' : '#6a4cff' },
			secondary: { main: mode === 'dark' ? '#03dac6' : '#00897b' },
			text: { primary: mode === 'dark' ? '#ffffff' : '#1a1a1a', secondary: mode === 'dark' ? '#bdbdbd' : '#424242' },
			divider: mode === 'dark' ? '#333' : '#ddd',
		},
		typography: {
			fontFamily: ['Roboto', 'Consolas', 'Courier New', 'monospace', 'Arial', 'sans-serif'].join(','),
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					'*:focus': { outline: 'none' },
					'*:focus-visible': { outline: 'none' },
				},
			},
		},
	})

export const useAdminTheme = () => useContext(AdminThemeCtx)!

export default function AdminThemeProvider({ children }: { children: React.ReactNode }) {
	const [mode, setMode] = useState<PaletteMode>('dark')
	useEffect(() => {
		const saved = (localStorage.getItem('admin-mode') as PaletteMode) || 'dark'
		setMode(saved)
	}, [])
	const toggle = () => {
		setMode(m => {
			const next = m === 'dark' ? 'light' : 'dark'
			localStorage.setItem('admin-mode', next)
			return next
		})
	}
	const theme = useMemo(() => buildTheme(mode), [mode])
	return (
		<AdminThemeCtx.Provider value={{ mode, toggle }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AdminThemeCtx.Provider>
	)
}

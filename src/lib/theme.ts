'use client'
import { createTheme, PaletteMode } from '@mui/material'

export const theme = (mode: PaletteMode) =>
	createTheme({
		palette: {
			mode,
			background: {
				default: mode === 'light' ? '#18181b' : '#78350f', // light= zinc-900, dark= amber-900
				paper: mode === 'light' ? '#27272a' : '#92400e', // light= zinc-800, dark= amber-800
			},
			text: {
				primary: mode === 'light' ? '#22c55e' : '#fcd34d', // light= green-500, dark= amber-300
			},
			primary: {
				main: mode === 'light' ? '#22c55e' : '#fcd34d',
			},
			secondary: {
				main: mode === 'light' ? '#15803d' : '#fde68a', // focus: green-700 / amber-200
			},
			divider: mode === 'light' ? '#22c55e' : '#fcd34d',
		},
		components: {
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
							borderColor: mode === 'light' ? '#15803d' : '#fde68a',
						},
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						'&.Mui-focused': {
							color: mode === 'light' ? '#15803d' : '#fde68a',
						},
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						'&:focus-visible': {
							outline: `2px solid ${mode === 'light' ? '#15803d' : '#fde68a'}`,
							outlineOffset: '2px',
						},
					},
				},
			},
		},
		typography: {
			fontFamily: ['Share Tech Mono', '__Share_Tech_Mono_439932', '__Share_Tech_Mono_Fallback_439932'].join(','),
		},
	})

export default theme

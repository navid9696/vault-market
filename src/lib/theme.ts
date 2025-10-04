'use client'
import { createTheme, PaletteMode } from '@mui/material'

const theme = (mode: PaletteMode) => {
	const light = mode === 'light'

	return createTheme({
		palette: {
			mode,
			background: {
				default: light ? '#173117' : '#361e10',
				paper: light ? '#0f180f' : '#0f0500',
			},
			text: {
				primary: light ? '#66ff00' : '#ffb641',
				secondary: light ? '#99cc99' : '#ffcc6e',
			},
			primary: {
				main: light ? '#33cc33' : '#d37120',
			},
			secondary: {
				main: light ? '#aaff00' : '#d97708',
			},
			divider: light ? '#33cc33' : '#a65a1a',
			action: {
				active: light ? '#99cc99' : '#fbbf24',
			},
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					'*:focus': { outline: 'none' },
					'*:focus-visible': { outline: 'none' },
				},
			},
			MuiCheckbox: {
				styleOverrides: {
					root: ({ theme }) => ({
						color: theme.palette.text.secondary,
						'&.Mui-checked': {
							color: theme.palette.primary.main,
						},
					}),
				},
			},
			MuiRadio: {
				styleOverrides: {
					root: ({ theme }) => ({
						color: theme.palette.text.secondary,
						'&.Mui-checked': {
							color: theme.palette.primary.main,
						},
					}),
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
							borderColor: light ? '#aaff00' : '#f59e0b',
						},
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						'&.Mui-focused': {
							color: light ? '#aaff00' : '#f59e0b',
						},
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						'&:focus-visible': {
							outline: `2px solid ${light ? '#aaff00' : '#f59e0b'}`,
							outlineOffset: '2px',
						},
					},
				},
			},
			MuiSwitch: {
				styleOverrides: {
					root: ({ theme }) => ({
						'& .MuiSwitch-switchBase.Mui-checked': {
							color: light ? theme.palette.primary.main : theme.palette.secondary.main,
						},
						'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
							color: light ? theme.palette.primary.main : theme.palette.secondary.main,
						},
					}),
				},
			},
		},
		typography: {
			fontFamily: ['Share Tech Mono', '__Share_Tech_Mono_439932', '__Share_Tech_Mono_Fallback_439932'].join(','),
		},
	})
}

export default theme

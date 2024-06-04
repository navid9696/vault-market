'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { createTheme, ThemeProvider } from '@mui/material'

const Home = () => {
	const theme = createTheme({
		typography: {
			fontFamily: ['Share_Tech_Mono', 'monospace'].join(','),
		},
	})
	return (
		<>
			<ThemeProvider theme={theme}>
				<Navbar />
			</ThemeProvider>
		</>
	)
}

export default Home

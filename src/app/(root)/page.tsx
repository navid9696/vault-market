'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { createTheme, ThemeProvider } from '@mui/material'

const Home = () => {
	const theme = createTheme({
		typography: {
			fontFamily: ['__Share_Tech_Mono_3ec33c','__Share_Tech_Mono_Fallback_3ec33c'].join(','),
		},
	})
	return (
		<>
			<ThemeProvider theme={theme}>
				<Navbar />
				<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
			</ThemeProvider>
		</>
	)
}

export default Home

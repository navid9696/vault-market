'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { createTheme, ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'

const Home = () => {
	const theme = createTheme({
		typography: {
			fontFamily: ['__Share_Tech_Mono_3ec33c', '__Share_Tech_Mono_Fallback_3ec33c'].join(','),
		},
	})

	return (
		<>
			<ThemeProvider theme={theme}>
				<Navbar />
				<ToastContainer autoClose={1500} draggablePercent={60} stacked hideProgressBar />
				<div className='h-[2000px]'></div>
			</ThemeProvider>
		</>
	)
}

export default Home

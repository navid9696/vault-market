'use client'

import Header from '~/components/Header'
import Navbar from '~/components/Navbar'
import ProductsList from '~/components/ProductsList'
import { createTheme, ThemeProvider } from '@mui/material'

import { ToastContainer } from 'react-toastify'
import OnSaleList from '~/components/OnSaleList'
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

				<div className='h-dvh'>
					<Header />
					<OnSaleList />
				</div>
				<main className='mx-auto flex flex-col justify-center items-center max-w-screen-lg'>
					<ProductsList />
					<div className='h-[2000px] w-full bg-slate-100'></div>
				</main>

			</ThemeProvider>
		</>
	)
}

export default Home

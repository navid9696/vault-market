'use client'

import Header from '~/components/Header'
import Navbar from '~/components/Navbar'
import ProductsBrowsing from '~/components/ProductsBrowsing'
import { createTheme, ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import OnSaleList from '~/components/OnSaleList'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'

const Home = () => {
	const theme = createTheme({
		typography: {
			fontFamily: ['__Share_Tech_Mono_3ec33c', '__Share_Tech_Mono_Fallback_3ec33c'].join(','),
		},
	})

	return (
		<>
			<ThemeProvider theme={theme}>
				<NavigationProvider>
					<Navbar />
					<ToastContainer autoClose={1500} draggablePercent={60} stacked hideProgressBar />
					<div className='h-dvh'>
						<Header />
						<OnSaleList />
					</div>
					<main className='mx-auto flex flex-col justify-center items-center max-w-screen-lg'>
						<ProductsBrowsing />
					</main>
					<Footer />
				</NavigationProvider>
			</ThemeProvider>
		</>
	)
}

export default Home

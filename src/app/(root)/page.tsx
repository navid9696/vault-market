'use client'

import Header from '~/components/Header'
import Navbar from '~/components/Navbar'
import ProductsBrowsing from '~/components/ProductsBrowsing'
import { ToastContainer } from 'react-toastify'
import OnSaleList from '~/components/OnSaleList'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'
import { ThemeProvider } from '@mui/material'
import theme from '~/lib/theme'

const Home = () => {
	return (
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
	)
}

export default Home

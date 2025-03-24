'use client'

import Navbar from '~/components/Navbar'
import { ToastContainer } from 'react-toastify'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'
import { ThemeProvider } from '@mui/material'
import theme from '~/lib/theme'
import { SessionProvider } from 'next-auth/react'
import Checkout from '~/components/Checkout'

const Home = () => {
	return (
		<SessionProvider>
			<ThemeProvider theme={theme}>
				<NavigationProvider>
					<Navbar />
					<ToastContainer autoClose={3000} draggablePercent={60} stacked hideProgressBar />
					<main className='mx-auto flex flex-col justify-center items-center max-w-screen-xl'>
						<Checkout />
					</main>
					<Footer />
				</NavigationProvider>
			</ThemeProvider>
		</SessionProvider>
	)
}

export default Home

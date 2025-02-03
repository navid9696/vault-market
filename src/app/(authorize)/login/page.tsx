'use client'

import Navbar from '~/components/Navbar'
import { ToastContainer } from 'react-toastify'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'
import { ThemeProvider } from '@mui/material'
import theme from '~/lib/theme'
import LoginForm from '~/components/LoginForm'
import Image from 'next/image'
import { SessionProvider } from 'next-auth/react'

const Home = () => {
	return (
		<SessionProvider>
			<ThemeProvider theme={theme}>
				<NavigationProvider>
					<Navbar />
					<ToastContainer autoClose={1500} draggablePercent={60} stacked hideProgressBar />
					<main className='flex bg-green-900 '>
						<div className='hidden md:block relative w-1/2'>
							<Image className='object-cover' src={'/imgs/diamondCityMarket.webp'} alt='Diamond City Market' fill />
						</div>
						<div className='flex-1'>
							<LoginForm />
						</div>
					</main>

					<Footer />
				</NavigationProvider>
			</ThemeProvider>
		</SessionProvider>
	)
}

export default Home

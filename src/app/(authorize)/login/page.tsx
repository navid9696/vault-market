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
			<NavigationProvider>
				<Navbar />
				<ToastContainer autoClose={3000} draggablePercent={60} stacked hideProgressBar />
				<main className='relative min-h-screen'>
					<div className='absolute inset-0 -z-10 '>
						<Image className='object-contain' src='/imgs/authBg.png' alt='Background' fill />
					</div>

					<div className='flex items-center justify-center h-full'>
						<LoginForm />
					</div>
				</main>

				<Footer />
			</NavigationProvider>
		</SessionProvider>
	)
}

export default Home

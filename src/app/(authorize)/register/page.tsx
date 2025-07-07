'use client'

import Navbar from '~/components/Navbar'
import { ToastContainer } from 'react-toastify'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'
import Image from 'next/image'
import RegisterForm from '~/components/RegisterForm'
import { SessionProvider } from 'next-auth/react'

const Home = () => {
	return (
		<SessionProvider>
			<NavigationProvider>
				<Navbar />
				<ToastContainer autoClose={3000} draggablePercent={60} stacked hideProgressBar />
				<main className='relative min-h-screen'>
					<div className='absolute inset-0 -z-10 '>
						<Image src='/imgs/authBg.png' alt='Background' fill style={{ objectFit: 'contain' }} />
					</div>

					<div className='flex items-center justify-center h-full'>
						<RegisterForm />
					</div>
				</main>

				<Footer />
			</NavigationProvider>
		</SessionProvider>
	)
}

export default Home

'use client'

import Navbar from '~/components/Navbar'
import { ToastContainer } from 'react-toastify'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'
import { SessionProvider } from 'next-auth/react'
import Favorites from '~/components/Favorites'

const Home = () => {
	return (
		<SessionProvider>
			<NavigationProvider>
				<Navbar />
				<ToastContainer className={'vault-toast'} autoClose={3000} draggablePercent={60} stacked hideProgressBar />
				<main className='mx-auto flex flex-col justify-center items-center max-w-screen-xl'>
					<Favorites />
				</main>
				<Footer />
			</NavigationProvider>
		</SessionProvider>
	)
}

export default Home

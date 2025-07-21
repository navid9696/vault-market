'use client'

import Header from '~/components/Header'
import Navbar from '~/components/Navbar'
import ProductsBrowsing from '~/components/ProductsBrowsing'
import { ToastContainer } from 'react-toastify'
import OnSaleList from '~/components/OnSaleList'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'
import { SessionProvider } from 'next-auth/react'

const Home = () => {
	return (
		<SessionProvider>
			<NavigationProvider>
				<Navbar />
				<ToastContainer autoClose={3000} draggablePercent={60} stacked hideProgressBar />
				<div className='h-dvh'>
					<Header />
					<OnSaleList />
				</div>
				<main className='mx-auto flex flex-col justify-center items-center max-w-screen-xl'>
					<ProductsBrowsing />
				</main>
				<Footer />
			</NavigationProvider>
		</SessionProvider>
	)
}

export default Home

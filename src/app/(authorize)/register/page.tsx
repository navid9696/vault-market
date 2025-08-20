'use client'

import Navbar from '~/components/Navbar'
import { ToastContainer } from 'react-toastify'
import Footer from '~/components/Footer'
import { NavigationProvider } from '~/context/NavbarHeightContext'
import Image from 'next/image'
import LoginForm from '~/components/LoginForm'
import { SessionProvider } from 'next-auth/react'
import RegisterForm from '~/components/RegisterForm'

export default function Home() {
	return (
		<SessionProvider>
			<NavigationProvider>
				<Navbar />
				<ToastContainer className={'vault-toast'} autoClose={3000} draggablePercent={60} stacked hideProgressBar />
				<main className='relative min-h-screen'>
					<div className='absolute inset-0 -z-10 '>
						<Image
							src='/imgs/authBg2.jpg'
							alt='Background small'
							fill
							className='object-cover bg-small dark:filter dark:hue-rotate-[-70deg]'
						/>
						<Image
							src='/imgs/authBg.png'
							alt='Background large'
							fill
							className='object-contain bg-large dark:filter dark:hue-rotate-[-70deg]'
						/>
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

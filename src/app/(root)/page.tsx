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
		// components: {
		// 	MuiInputBase: {
		// 		styleOverrides: { root: { fontFamily: ['__VT323_4ca395', '__VT323_Fallback_4ca395'].join(',') } },
		// 	},
		// },
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

				{/* <div className='fixed inset-0 lg:bg-gradient-to-r from-zinc-950 to-transparent to-10%  -z-50'></div>
				<div className='fixed inset-0 lg:bg-gradient-to-l from-zinc-950 to-transparent to-10%  -z-50'></div> */}
				{/* <div className='fixed inset-0 shadow-custom-inset z-10'></div> */}
				{/* <div className="hidden lg:block top-36 fixed inset-0 bg-[url('/imgs/background.jpg')] bg-top bg-no-repeat bg-cover  -z-50"></div> */}
				{/* <div className='fixed inset-0 bg-gradient-to-b from-zinc-950 from-20% to-transparent to-30% -z-50'></div> */}
			</ThemeProvider>
		</>
	)
}

export default Home

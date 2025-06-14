import React from 'react'
import { ToastContainer } from 'react-toastify'
import AdminDisplayProducts from '~/components/AdminDisplayProducts'
import 'react-toastify/dist/ReactToastify.css'

const AdminProducts = () => {
	return (
		<>
			<ToastContainer autoClose={3000} draggablePercent={60} stacked hideProgressBar />
			<AdminDisplayProducts />
		</>
	)
}

export default AdminProducts

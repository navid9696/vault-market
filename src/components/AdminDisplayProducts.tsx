'use client'

import { Button, CircularProgress } from '@mui/material'
import { useState } from 'react'
import AdminProductCard from '~/components/AdminProductCard'
import TransitionsModal from './TransitionModal'
import AddOrEditProductForm from '~/components/AddOrEditProductForm'
import { trpc } from '~/server/client'

const AdminDisplayProducts = () => {
	const [modalOpen, setModalOpen] = useState(false)
	const { data: products, isLoading, isError, error } = trpc.product.getProducts.useQuery()

	const handleModalOpen = () => {
		setModalOpen(true)
	}

	const handleModalClose = () => {
		setModalOpen(false)
	}

	const renderModalContent = () => {
		return <AddOrEditProductForm />
	}

	if (isLoading) {
		return (
			<div className='p-2 h-screen flex justify-center items-center bg-gray-100'>
				<CircularProgress />
			</div>
		)
	}

	if (isError) {
		return (
			<div className='p-2 h-screen flex justify-center items-center bg-gray-100'>
				<h3 className='text-2xl text-red-600'>Error: {error.message}</h3>
			</div>
		)
	}

	return (
		<>
			<div className='p-2 h-screen flex justify-center items-center bg-gray-100'>
				<div className='border border-gray-300 rounded-lg p-6 bg-white shadow-lg w-full max-w-screen-2xl'>
					<h1 className='uppercase text-2xl font-semibold mb-4 text-center'>Total Products</h1>
					<div className='flex justify-center mb-6'>
						<Button
							onClick={handleModalOpen}
							className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'>
							Add New Product
						</Button>
					</div>

					<div className='border-t border-gray-200 pt-4 mt-4'>
						<div className='h-96 w-full flex flex-wrap gap-4 overflow-y-auto'>
							{products?.map(product => (
								<AdminProductCard
									id={product.id}
									key={product.id}
									name={product.name}
									price={product.price}
									rating={product.rating}
									available={product.available}
									popularity={product.popularity}
									discount={product.discount}
									categoryId={product.categoryId}
									subCategoryId={product.subCategoryId}
									imgURL={product.imgURL}
									description={product.description}
									categoryName={product.categoryName}
									subCategoryName={product.subCategoryName}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				{renderModalContent()}
			</TransitionsModal>
		</>
	)
}

export default AdminDisplayProducts

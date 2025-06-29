'use client'

import { useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { trpc } from '~/server/client'
import ProductSearch from './ProductSearch'
import ProductList from './ProductList'
import { Button } from '@mui/material'
import TransitionsModal from './TransitionModal'
import AddOrEditProductForm from './AddOrEditProductForm'

const AdminDisplayProducts = () => {
	const [inputValue, setInputValue] = useState('')
	const debouncedSearch = useDebounce(inputValue, 500)
	const [modalOpen, setModalOpen] = useState(false)
	const handleModalOpen = () => setModalOpen(true)
	const handleModalClose = () => setModalOpen(false)
	const renderModalContent = () => {
		return <AddOrEditProductForm />
	}
	const {
		data: products = [],
		isLoading,
		isError,
		error,
	} = trpc.product.getProducts.useQuery(debouncedSearch ? { search: debouncedSearch } : {})

	if (isError) {
		return <div>Error: {error.message}</div>
	}

	return (
		<>
			<div className='p-2 h-screen flex justify-center items-center bg-gray-100 overflow-hidden'>
				<div className='h-5/6 border border-gray-300 rounded-lg p-6 bg-white shadow-lg w-full max-w-screen-2xl flex flex-col'>
					<h1 className='uppercase text-2xl font-semibold mb-4 text-center'>Total Products</h1>
					<div className='flex justify-evenly gap-2 mb-4'>
						<Button
							onClick={handleModalOpen}
							className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'>
							Add New Product
						</Button>
						<ProductSearch
							products={products}
							isLoading={isLoading}
							inputValue={inputValue}
							setInputValue={setInputValue}
						/>
					</div>

					<div className='flex-grow border-t border-gray-200 pt-4 overflow-y-auto'>
						<ProductList products={products} isLoading={isLoading} />
					</div>
				</div>
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose} border='2px solid #ddd'>
				{renderModalContent()}
			</TransitionsModal>
		</>
	)
}

export default AdminDisplayProducts

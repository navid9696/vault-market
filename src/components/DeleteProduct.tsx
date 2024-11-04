import { Button } from '@mui/material'
import React from 'react'
import { ProductCardProps } from './ProductCard'
import { toast } from 'react-toastify'

interface DeleteProductProps {
	handleClose: () => void
	product: ProductCardProps
}

const DeleteProduct = ({ handleClose, product }: DeleteProductProps) => {
	const deleteProduct = async () => {
		try {
			const res = await toast.promise(
				fetch(`/api/products/${product.id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}),
				{
					pending: 'Deleting product... Please wait ⏳',
					success: 'Product successfully deleted! 🗑️',
					error: 'Failed to delete product. Something went wrong! 🚫😓',
				}
			)

			if (!res.ok) {
				throw new Error('Failed to delete product')
			}
			handleClose()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<>
			<h2 className='mb-8 text-xl'>Are you sure you want to delete your account?</h2>
			<div className='flex justify-center gap-20'>
				<Button color='error' variant='outlined' size='large' onClick={deleteProduct}>
					Delete
				</Button>
				<Button variant='contained' size='large' onClick={handleClose}>
					Cancel
				</Button>
			</div>
		</>
	)
}

export default DeleteProduct

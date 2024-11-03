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
			const res = await fetch(`/api/products/${product.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				throw new Error('Failed to delete product')
			}
			console.log('Product deleted successfully')
			
			handleClose()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<>
			<h2>Are you sure you want to delete your account?</h2>
			<div className='flex justify-center gap-20'>
				<Button variant='outlined' size='large' onClick={deleteProduct}>
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

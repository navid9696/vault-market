import { Button } from '@mui/material'
import React from 'react'
import { ProductCardProps } from './ProductCard'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'

interface DeleteProductProps {
	handleClose: () => void
	product: ProductCardProps
}

const DeleteProduct = ({ handleClose, product }: DeleteProductProps) => {
	const deleteProductMutation = trpc.product.deleteProduct.useMutation()

	const deleteProduct = async () => {
		try {
			await toast.promise(deleteProductMutation.mutateAsync({ id: product.id }), {
				pending: 'Deleting product... Please wait ⏳',
				success: 'Product successfully deleted! 🗑️',
				error: 'Failed to delete product. Something went wrong! 🚫😓',
			})
			handleClose()
		} catch (error) {
			console.error('Error:', error)
		}
	}
	return (
		<>
			<h2 className='mb-8 text-xl'>Are you sure you want to delete this product?</h2>
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

'use client'
import React from 'react'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'
import { ProductCardProps } from './ProductCard'

interface DeleteProductProps {
	handleClose: () => void
	product: ProductCardProps
}

const DeleteProduct = ({ handleClose, product }: DeleteProductProps) => {
	const utils = trpc.useUtils()
	const deleteMutation = trpc.product.deleteProduct.useMutation({
		onSuccess: () => {
			utils.product.getProducts.invalidate()
		},
	})

	const onDelete = async () => {
		try {
			await toast.promise(deleteMutation.mutateAsync({ id: product.id }), {
				pending: 'Deleting product... ⏳',
				success: 'Deleted! 🗑️',
				error: 'Delete failed 🚫',
			})
			handleClose()
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<>
			<h2 className='mb-8 text-xl'>Are you sure you want to delete this product?</h2>
			<div className='flex justify-center gap-20'>
				<Button color='error' variant='outlined' size='large' onClick={onDelete}>
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

// components/AddProductCard.tsx
'use client'

import { Button, TextField, Card, CardContent, Typography } from '@mui/material'
import { useState } from 'react'

import { ProductCardProps } from './ProductCard'

const AddProductCard = ({ onAddProduct }: { onAddProduct: (product: ProductCardProps) => void }) => {
	const [product, setProduct] = useState<ProductCardProps>({
		name: '',
		price: 0,
		rating: 0,
		available: 0,
		popularity: 0,
		onSale: 0,
		categoryId: 0,
		subCategoryId: 0,
		imgURL: '',
		description: '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target
		setProduct(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onAddProduct(product)

		setProduct({
			name: '',
			price: 0,
			rating: 0,
			available: 0,
			popularity: 0,
			onSale: 0,
			categoryId: 0,
			subCategoryId: 0,
			imgURL: '',
			description: '',
		})
	}

	return (
		<Card variant='outlined' sx={{ padding: 2, margin: 2 }}>
			<CardContent>
				<Typography variant='h5' component='h2' gutterBottom>
					Add New Product
				</Typography>
				<form className='scale-75' onSubmit={handleSubmit}>
					<TextField
						label='Product Name'
						fullWidth
						margin='normal'
						name='name'
						value={product.name}
						onChange={handleChange}
					/>
					<TextField
						label='Price'
						type='number'
						fullWidth
						margin='normal'
						name='price'
						value={product.price}
						onChange={handleChange}
					/>
					<TextField
						label='Rating'
						type='number'
						fullWidth
						margin='normal'
						name='rating'
						value={product.rating}
						onChange={handleChange}
					/>
					<TextField
						label='Availability'
						type='number'
						fullWidth
						margin='normal'
						name='available'
						value={product.available}
						onChange={handleChange}
					/>
					<TextField
						label='Popularity'
						type='number'
						fullWidth
						margin='normal'
						name='popularity'
						value={product.popularity}
						onChange={handleChange}
					/>
					<TextField
						label='On Sale'
						type='number'
						fullWidth
						margin='normal'
						name='onSale'
						value={product.onSale}
						onChange={handleChange}
					/>
					<TextField
						label='Category ID'
						fullWidth
						margin='normal'
						name='categoryId'
						value={product.categoryId}
						onChange={handleChange}
					/>
					<TextField
						label='Subcategory ID'
						fullWidth
						margin='normal'
						name='subCategoryId'
						value={product.subCategoryId}
						onChange={handleChange}
					/>
					<TextField
						label='Image URL'
						fullWidth
						margin='normal'
						name='imgURL'
						value={product.imgURL}
						onChange={handleChange}
					/>
					<TextField
						label='Description'
						fullWidth
						multiline
						rows={4}
						margin='normal'
						name='description'
						value={product.description}
						onChange={handleChange}
					/>
					<Button type='submit' variant='contained' color='primary'>
						Add Product
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}

export default AddProductCard

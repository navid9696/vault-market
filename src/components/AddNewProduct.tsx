'use client'
import { v4 as uuidv4 } from 'uuid'
import { Button, MenuItem, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoriesData } from '~/data/categories'
import { useState } from 'react'

const productSchema = z.object({
	name: z.string().min(1, { message: 'Product name is required' }),
	price: z.number().positive({ message: 'Product price is required' }),
	available: z.number().nonnegative({ message: 'Availability cannot be negative' }),
	onSale: z
		.number()
		.nonnegative({ message: 'On sale cannot be negative' })
		.max(99, { message: 'Cannot me more than 99% (free item)' }),
	categoryName: z.string().min(1, { message: 'Category is required' }),
	subCategoryName: z.string().nullable(),
	imgURL: z.string().url({ message: 'Must be a valid URL' }),
	description: z.string().min(1, { message: 'Description is required' }),
})

type ProductFormData = z.infer<typeof productSchema>

const AddNewProductForm = () => {
	const [selectedCategory, setSelectedCategory] = useState('')

	const selectedSubCategories =
		categoriesData.categories.find(category => category.name === selectedCategory)?.subCategories || []

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductFormData>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			subCategoryName: null,
			price: 0,
			available: 0,
			onSale: 0,
		},
	})

	const onSubmit: SubmitHandler<ProductFormData> = async data => {
		try {
			const category = categoriesData.categories.find(cat => cat.name === data.categoryName)
			const subCategory = category?.subCategories.find(subCat => subCat.name === data.subCategoryName)

			const newProduct = {
				...data,
				id: uuidv4(),
				popularity: 0,
				rating: 0,
				categoryId: category?.id ?? null,
				subCategoryId: subCategory ? subCategory.id : null,
				onSale: data.onSale / 100,
			}

			const res = await fetch('http://localhost:3000/api/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newProduct),
			})

			if (!res.ok) {
				throw new Error('Failed to add product')
			}
			reset()
			console.log('Product added successfully')
		} catch (error) {
			console.error('Error adding product:', error)
		}
	}

	return (
		<>
			<Typography variant='h3' component='h2'>
				Add New Product
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					label='Product Name'
					margin='normal'
					{...register('name')}
					error={!!errors.name}
					helperText={errors.name?.message}
				/>
				<TextField
					label='Price'
					type='number'
					margin='normal'
					{...register('price', { valueAsNumber: true })}
					error={!!errors.price}
					helperText={errors.price?.message}
				/>
				<TextField
					label='Availability'
					type='number'
					margin='normal'
					{...register('available', { valueAsNumber: true })}
					error={!!errors.available}
					helperText={errors.available?.message}
				/>
				<TextField
					label='On Sale %'
					type='number'
					margin='normal'
					{...register('onSale', { valueAsNumber: true })}
					error={!!errors.onSale}
					helperText={errors.onSale?.message}
				/>
				<TextField
					className='w-52'
					id='outlined-select-category'
					select
					label='Select Category'
					{...register('categoryName', {
						onChange: e => {
							setSelectedCategory(e.target.value)
						},
					})}
					error={!!errors.categoryName}
					helperText={errors.categoryName?.message}
					margin='normal'>
					{categoriesData.categories.slice(1).map(category => (
						<MenuItem key={category.id} value={category.name}>
							{category.name}
						</MenuItem>
					))}
				</TextField>
				<TextField
					className='w-52'
					id='outlined-select-subcategory'
					select
					label='Select Subcategory'
					{...register('subCategoryName')}
					error={!!errors.subCategoryName}
					helperText={errors.subCategoryName?.message}
					margin='normal'>
					{selectedSubCategories.slice(1).map(subCategory => (
						<MenuItem key={subCategory.id} value={subCategory.name}>
							{subCategory.name}
						</MenuItem>
					))}
				</TextField>

				<TextField
					label='Image URL'
					margin='normal'
					fullWidth
					{...register('imgURL')}
					error={!!errors.imgURL}
					helperText={errors.imgURL?.message}
				/>
				<TextField
					label='Description'
					multiline
					rows={4}
					fullWidth
					margin='normal'
					{...register('description')}
					error={!!errors.description}
					helperText={errors.description?.message}
				/>
				<Button type='submit' variant='contained' color='primary'>
					Add Product
				</Button>
			</form>
		</>
	)
}

export default AddNewProductForm

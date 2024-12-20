'use client'
import { Button, MenuItem, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoriesData } from '~/data/categories'
import { useEffect } from 'react'
import { Media, MediaContextProvider } from '~/context/breakpointsContext'
import { productSchema } from '~/schemas/addOrEditProductSchema'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'

type ProductFormData = z.infer<typeof productSchema>

type Product = ProductFormData & {
	id: string
	popularity: number
	rating: number
}

interface AddOrEditProductFormProps {
	product?: Product
}

const AddOrEditProductForm = ({ product }: AddOrEditProductFormProps) => {
	const addProductMutation = trpc.product.addProduct.useMutation()
	const editProductMutation = trpc.product.editProduct.useMutation()
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ProductFormData>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: product?.name,
			price: product?.price,
			available: product?.available,
			discount: product ? Number(product.discount.toFixed(2)) : undefined,
			categoryName: product?.categoryName,
			subCategoryName: product?.subCategoryName,
			imgURL: product?.imgURL,
			description: product?.description,
		},
	})

	const selectedCategory = watch('categoryName')

	const selectedSubCategories =
		categoriesData.categories.find(category => category.name === selectedCategory)?.subCategories || []

	useEffect(() => {
		if (product) {
			setValue('categoryName', product.categoryName)
			setValue('subCategoryName', product.subCategoryName)
		}
	}, [product, setValue])

	const onSubmit: SubmitHandler<ProductFormData> = async data => {
		try {
			const category = categoriesData.categories.find(cat => cat.name === data.categoryName)
			const subCategory = category?.subCategories.find(subCat => subCat.name === data.subCategoryName)

			const productData = {
				...data,
				popularity: product ? product.popularity : 0,
				rating: product ? product.rating : 0,
				categoryId: category?.id ?? 0,
				subCategoryId: subCategory ? subCategory.id : null,
				categoryName: category?.name ?? '',
				subCategoryName: subCategory?.name ?? null,
				discount: data.discount / 100,
			}

			if (product) {
				await toast.promise(editProductMutation.mutateAsync(productData), {
					pending: 'Editing product... Please wait ⏳',
					success: 'Product successfully updated! ✅',
					error: 'Failed to update product. Something went wrong! 🚫😓',
				})
				console.log('Product updated successfully')
			} else {
				await toast.promise(addProductMutation.mutateAsync(productData), {
					pending: 'Adding product... Please wait ⏳',
					success: 'Product successfully added! 🎉',
					error: 'Failed to add product. Something went wrong! 🚫😓',
				})
				console.log('Product added successfully')
			}

			reset()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<MediaContextProvider>
			<Media greaterThanOrEqual='xl'>
				<Typography variant='h3' component='h2' gutterBottom>
					{product ? 'Edit Product' : 'Add New Product'}
				</Typography>
				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<div className='w-full flex flex-wrap items-center justify-between gap-x-4'>
						<TextField
							margin='dense'
							size='medium'
							className='w-full xl:w-[48%]'
							label='Product Name'
							{...register('name')}
							error={!!errors.name}
							helperText={errors.name ? errors.name.message : ' '}
						/>
						<TextField
							margin='dense'
							size='medium'
							className='w-full xl:w-[48%]'
							label='Price'
							type='number'
							{...register('price')}
							error={!!errors.price}
							helperText={errors.price ? errors.price.message : ' '}
						/>
						<TextField
							margin='dense'
							size='medium'
							className='w-full xl:w-[48%]'
							label='Availability'
							type='number'
							{...register('available')}
							error={!!errors.available}
							helperText={errors.available ? errors.available.message : ' '}
						/>
						<TextField
							margin='dense'
							size='medium'
							className='w-full xl:w-[48%]'
							label='Discount %'
							type='number'
							{...register('discount')}
							error={!!errors.discount}
							helperText={errors.discount ? errors.discount.message : ' '}
						/>
						<TextField
							margin='dense'
							size='medium'
							className='w-full xl:w-[48%]'
							id='outlined-select-category'
							select
							label='Select Category'
							{...register('categoryName', {
								onChange: e => {
									setValue('subCategoryName', '')
								},
							})}
							error={!!errors.categoryName}
							helperText={errors.categoryName ? errors.categoryName.message : ' '}>
							{categoriesData.categories.slice(1).map(category => (
								<MenuItem key={category.id} value={category.name}>
									{category.name}
								</MenuItem>
							))}
						</TextField>
						<TextField
							margin='dense'
							size='medium'
							className='w-full xl:w-[48%]'
							id='outlined-select-subcategory'
							select
							label='Select Subcategory'
							{...register('subCategoryName')}
							error={!!errors.subCategoryName}
							helperText={errors.subCategoryName ? errors.subCategoryName.message : ' '}>
							{selectedSubCategories.length === 0 ? (
								<MenuItem disabled>
									No subcategories
									<br /> for this category
								</MenuItem>
							) : (
								selectedSubCategories.slice(1).map(subCategory => (
									<MenuItem key={subCategory.id} value={subCategory.name}>
										{subCategory.name}
									</MenuItem>
								))
							)}
						</TextField>
					</div>

					<TextField
						margin='dense'
						size='medium'
						label='Image URL'
						fullWidth
						{...register('imgURL')}
						error={!!errors.imgURL}
						helperText={errors.imgURL ? errors.imgURL.message : ' '}
					/>
					<TextField
						margin='dense'
						size='medium'
						label='Description'
						multiline
						rows={4}
						fullWidth
						{...register('description')}
						error={!!errors.description}
						helperText={errors.description ? errors.description.message : ' '}
					/>
					<Button type='submit' size='large' variant='contained' color='primary'>
						{product ? 'Update Product' : 'Add Product'}
					</Button>
				</form>
			</Media>

			<Media className='m-[-30px]' lessThan='xl'>
				<Typography variant='h5' component='h2' gutterBottom>
					{product ? 'Edit Product' : 'Add New Product'}
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='w-full flex flex-wrap items-center justify-between gap-x-4'>
						<TextField
							margin='none'
							size='small'
							className='w-full '
							label='Product Name'
							{...register('name')}
							error={!!errors.name}
							helperText={errors.name ? errors.name.message : ' '}
						/>
						<TextField
							margin='none'
							size='small'
							className='w-full '
							label='Price'
							type='number'
							{...register('price')}
							error={!!errors.price}
							helperText={errors.price ? errors.price.message : ' '}
						/>
						<TextField
							margin='none'
							size='small'
							className='w-full '
							label='Availability'
							type='number'
							{...register('available')}
							error={!!errors.available}
							helperText={errors.available ? errors.available.message : ' '}
						/>
						<TextField
							margin='none'
							size='small'
							className='w-full '
							label='Discount %'
							type='number'
							{...register('discount')}
							error={!!errors.discount}
							helperText={errors.discount ? errors.discount.message : ' '}
						/>
						<TextField
							margin='none'
							size='small'
							className='w-full '
							id='outlined-select-category'
							select
							label='Select Category'
							{...register('categoryName', {
								onChange: e => {
									setValue('subCategoryName', '')
								},
							})}
							error={!!errors.categoryName}
							helperText={errors.categoryName ? errors.categoryName.message : ' '}>
							{categoriesData.categories.slice(1).map(category => (
								<MenuItem key={category.id} value={category.name}>
									{category.name}
								</MenuItem>
							))}
						</TextField>
						<TextField
							margin='none'
							size='small'
							className='w-full '
							id='outlined-select-subcategory'
							select
							label='Select Subcategory'
							{...register('subCategoryName')}
							error={!!errors.subCategoryName}
							helperText={errors.subCategoryName ? errors.subCategoryName.message : ' '}>
							{selectedSubCategories.length === 0 ? (
								<MenuItem disabled>
									No subcategories
									<br /> for this category
								</MenuItem>
							) : (
								selectedSubCategories.slice(1).map(subCategory => (
									<MenuItem key={subCategory.id} value={subCategory.name}>
										{subCategory.name}
									</MenuItem>
								))
							)}
						</TextField>
					</div>

					<TextField
						margin='none'
						size='small'
						label='Image URL'
						fullWidth
						{...register('imgURL')}
						error={!!errors.imgURL}
						helperText={errors.imgURL ? errors.imgURL.message : ' '}
					/>
					<TextField
						margin='none'
						size='small'
						label='Description'
						multiline
						rows={4}
						fullWidth
						{...register('description')}
						error={!!errors.description}
						helperText={errors.description ? errors.description.message : ' '}
					/>
					<Button type='submit' size='small' variant='contained' color='primary'>
						{product ? 'Update Product' : 'Add Product'}
					</Button>
				</form>
			</Media>
		</MediaContextProvider>
	)
}

export default AddOrEditProductForm

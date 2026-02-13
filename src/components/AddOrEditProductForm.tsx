'use client'
import { Button, MenuItem, TextField, Typography, Box } from '@mui/material'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoriesData } from '~/data/categories'
import { useEffect, useState } from 'react'
import { Media, MediaContextProvider } from '~/context/breakpointsContext'
import { productSchema } from '~/schemas/addOrEditProductSchema'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'
import Image from 'next/image'

type ProductFormData = z.infer<typeof productSchema>

type Product = ProductFormData & {
	id: string
	popularity: number
	rating: number
}

interface AddOrEditProductFormProps {
	product?: Product
	onSuccess?: () => void
}

const AddOrEditProductForm = ({ product, onSuccess }: AddOrEditProductFormProps) => {
	const utils = trpc.useUtils()
	const addMutation = trpc.product.addProduct.useMutation({
		onSuccess() {
			utils.product.getProducts.invalidate()
		},
	})
	const editMutation = trpc.product.editProduct.useMutation({
		onSuccess() {
			utils.product.getProducts.invalidate()
		},
	})

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
	const selectedSubCategories = categoriesData.categories.find(c => c.name === selectedCategory)?.subCategories || []

	const [preview, setPreview] = useState<string>(product?.imgURL ?? '')
	const [uploading, setUploading] = useState(false)

	useEffect(() => {
		if (product) {
			setValue('categoryName', product.categoryName)
			setValue('subCategoryName', product.subCategoryName ?? '')
			setValue('imgURL', product.imgURL)
		}
	}, [product, setValue])

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Unsupported file type. Please select an image.')
			e.target.value = ''
			return
		}

		const MAX_SIZE = 8 * 1024 * 1024
		if (file.size > MAX_SIZE) {
			toast.error('File is too large. Maximum size is 8MB.')
			e.target.value = ''
			return
		}

		const formData = new FormData()
		formData.append('file', file)

		const toastId = toast.loading('Uploading image...')

		setUploading(true)
		try {
			const res = await fetch('/api/uploadProductImg', {
				method: 'POST',
				body: formData,
			})

			if (!res.ok) {
				const errData = await res.json().catch(() => null)
				throw new Error(errData?.error ?? `Upload failed (${res.status})`)
			}

			const data = await res.json()

			if (typeof data?.secure_url === 'string') {
				setValue('imgURL', data.secure_url, { shouldValidate: true, shouldDirty: true })
				setPreview(data.secure_url)

				toast.update(toastId, {
					render: 'Upload completed.',
					type: 'success',
					isLoading: false,
					autoClose: 1500,
				})
			} else {
				throw new Error('Upload failed. No URL returned.')
			}
		} catch (err: any) {
			toast.update(toastId, {
				render: typeof err?.message === 'string' ? err.message : 'Upload failed.',
				type: 'error',
				isLoading: false,
				autoClose: 3000,
			})
		} finally {
			setUploading(false)
			e.target.value = ''
		}
	}

	const onSubmit: SubmitHandler<ProductFormData> = async data => {
		const category = categoriesData.categories.find(c => c.name === data.categoryName)
		const subCategory = category?.subCategories.find(s => s.name === data.subCategoryName)
		const payload = {
			...data,
			popularity: product?.popularity ?? 0,
			rating: product?.rating ?? 0,
			categoryId: category?.id ?? 0,
			subCategoryId: subCategory?.id ?? null,
			discount: data.discount / 100,
		}

		try {
			if (product) {
				await toast.promise(editMutation.mutateAsync({ id: product.id, ...payload }), {
					pending: 'Editing…',
					success: 'Updated!',
					error: 'Update failed',
				})
				onSuccess?.()
			} else {
				await toast.promise(addMutation.mutateAsync(payload), {
					pending: 'Adding…',
					success: 'Added!',
					error: 'Add failed',
				})
				onSuccess?.()
			}

			reset()
			setPreview('')
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<MediaContextProvider>
			<Media greaterThanOrEqual='xl'>
				<Typography variant='h3' component='h2' gutterBottom>
					{product ? 'Edit Product' : 'Add New Product'}
				</Typography>
				<form className='' noValidate onSubmit={handleSubmit(onSubmit)}>
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

					<Box className=' flex items-center justify-around'>
						<Button variant='contained' component='label' disabled={uploading}>
							{uploading ? 'Uploading…' : preview ? 'Change Image' : 'Upload Image'}
							<input type='file' hidden accept='image/*' onChange={handleFileChange} />
						</Button>

						{preview && (
							<Box className='relative' style={{ width: 200, height: 200 }}>
								<Image src={preview} alt='Preview' fill objectFit='contain' />
							</Box>
						)}
					</Box>

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
					<Button type='submit' disabled={uploading} size='large' variant='contained' color='primary'>
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

					<Box className='flex items-center justify-around'>
						<Button className='mr-2' variant='contained' component='label' disabled={uploading}>
							{uploading ? 'Uploading…' : preview ? 'Change Image' : 'Upload Image'}
							<input type='file' hidden accept='image/*' onChange={handleFileChange} />
						</Button>

						{preview && (
							<Box className='relative' style={{ width: 150, height: 150 }}>
								<Image src={preview} alt='Preview' fill objectFit='contain' />
							</Box>
						)}
					</Box>

					<TextField
						className='mt-6'
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
					<Button type='submit' disabled={uploading} size='small' variant='contained' color='primary'>
						{product ? 'Update Product' : 'Add Product'}
					</Button>
				</form>
			</Media>
		</MediaContextProvider>
	)
}

export default AddOrEditProductForm

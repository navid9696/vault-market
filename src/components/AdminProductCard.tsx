import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CardActions } from '@mui/material'
import { ProductCardProps } from './ProductCard'
import Image from 'next/image'
import { categoriesData } from '~/data/categories'
import AddOrEditProductForm from './AddOrEditProductForm'
import { useState } from 'react'
import TransitionsModal from './TransitionModal'

const AdminProductCard = ({
	id,
	name,
	price,
	rating,
	discount,
	available,
	imgURL,
	description,
	popularity,
	categoryId,
	subCategoryId,
	categoryName,
	subCategoryName,
}: ProductCardProps) => {
	const [modalOpen, setModalOpen] = useState(false)

	const handleModalOpen = () => {
		setModalOpen(true)
	}

	const handleModalClose = () => {
		setModalOpen(false)
	}

	const productData = {
		id: id,
		name: name,
		price: price,
		available: available,
		discount: discount * 100,
		categoryName: categoryName || '',
		subCategoryName: subCategoryName || null,
		imgURL: imgURL,
		description: description,
		popularity: popularity ?? 0,
		rating: rating ?? 0,
	}

	console.log('productData', productData)

	const renderModalContent = () => {
		return <AddOrEditProductForm product={productData} />
	}
	return (
		<>
			<Card className='p-2 flex flex-col  min-h-96 w-[350px] rounded-md overflow-hidden shadow-md border'>
				<div className='relative h-32'>
					<Image className='object-contain' src={imgURL} fill alt={name} />
				</div>
				<CardContent className='flex-grow'>
					<Typography gutterBottom variant='h5' className='text-center font-semibold'>
						{name}
					</Typography>
					<Typography variant='body2' color='text.secondary' className='mb-2'>
						{description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, voluptas?
					</Typography>
					<Typography variant='body2' color='text.primary' className='font-medium'>
						Regular price: ${price}
					</Typography>
					<Typography variant='body2' color='error.main' className='font-medium'>
						{discount ? `New price: $${(price * (1 - discount)).toFixed(0)}` : false}
					</Typography>
					<Typography variant='body2' color='text.primary' className='font-medium'>
						Rating: {rating}/5
					</Typography>
					<Typography variant='body2' color={discount ? 'error.main' : 'text.secondary'} className='font-medium'>
						{discount ? `Discount! ${(discount * 100).toFixed()}%` : 'Regular Price'}
					</Typography>
					<Typography variant='body2' color={available ? 'success.main' : 'error.main'} className='font-medium'>
						{available ? `In Stock: ${available}` : 'Out of Stock'}
					</Typography>
					<Typography variant='body2' color='text.primary' className='font-medium'>
						Popularity: {popularity}
					</Typography>
					<Typography variant='body2' color='text.primary' className='font-medium'>
						Category ID | Name: {categoryId} | {categoryName}
					</Typography>
					{subCategoryId && (
						<Typography variant='body2' color='text.primary' className='font-medium'>
							Subcategory ID | Name: {subCategoryId} | {subCategoryName}
						</Typography>
					)}
				</CardContent>
				<CardActions sx={{ justifyContent: 'space-between' }}>
					<Button onClick={handleModalOpen} size='small' color='primary' variant='contained'>
						Edit
					</Button>
					<Button size='small' color='error' variant='outlined'>
						Delete
					</Button>
				</CardActions>
			</Card>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				{renderModalContent()}
			</TransitionsModal>
		</>
	)
}

export default AdminProductCard

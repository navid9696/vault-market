import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CardActions } from '@mui/material'
import { ProductCardProps } from './ProductCard'
import Image from 'next/image'
import { categoriesData } from '~/data/categories'

const AdminProductCard = ({
	name,
	price,
	rating,
	onSale,
	available,
	imgURL,
	description,
	popularity,
	categoryId,
	subCategoryId,
}: ProductCardProps) => {
	// const categoryName = categoriesData.categories.find(category => category.id === categoryId)

	return (
		<Card className='p-2 flex flex-col  min-h-96 w-80 rounded-md overflow-hidden shadow-md border'>
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
					{onSale ? `New price: $${(price * (1 - onSale)).toFixed(0)}` : false}
				</Typography>
				<Typography variant='body2' color='text.primary' className='font-medium'>
					Rating: {rating}/5
				</Typography>
				<Typography variant='body2' color={onSale ? 'error.main' : 'text.secondary'} className='font-medium'>
					{onSale ? `On Sale! ${(onSale * 100).toFixed()}%` : 'Regular Price'}
				</Typography>
				<Typography variant='body2' color={available ? 'success.main' : 'error.main'} className='font-medium'>
					{available ? `In Stock: ${available}` : 'Out of Stock'}
				</Typography>
				<Typography variant='body2' color='text.primary' className='font-medium'>
					Popularity: {popularity}
				</Typography>
				<Typography variant='body2' color='text.primary' className='font-medium'>
					{/* Category ID/Name: `${categoryId}/${categoryName}` */}
				</Typography>
				{subCategoryId && (
					<Typography variant='body2' color='text.primary' className='font-medium'>
						Subcategory ID: {subCategoryId}
					</Typography>
				)}
			</CardContent>
			<CardActions sx={{ justifyContent: 'space-between' }}>
				<Button size='small' color='primary' variant='contained'>
					Edit
				</Button>
				<Button size='small' color='error' variant='outlined'>
					Delete
				</Button>
			</CardActions>
		</Card>
	)
}

export default AdminProductCard

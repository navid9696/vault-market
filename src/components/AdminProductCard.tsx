import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea, CardActions } from '@mui/material'
import { ProductCardProps } from './ProductCard'
import Image from 'next/image'

const AdminProductCard = ({ name, price, rating, onSale, available, imgURL, description }: ProductCardProps) => {
	return (
		<Card className='flex flex-col justify-between' sx={{ height: 450, width: 300, borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}>
			<CardActionArea>
				<div className='relative h-48'>
					<Image className='object-contain' src={imgURL} fill alt={name} />
				</div>
				<CardContent>
					<Typography gutterBottom variant='h5' className='text-center font-semibold'>
						{name}
					</Typography>
					<Typography variant='body2' color='text.secondary' className='mb-2'>
						{description}
					</Typography>
					<Typography variant='body2' color='text.primary' className='font-medium'>
						Price: ${price}
					</Typography>
					<Typography variant='body2' color='text.primary' className='font-medium'>
						Rating: {rating}/5
					</Typography>
					<Typography variant='body2' color={onSale ? 'error.main' : 'text.secondary'} className='font-medium'>
						{onSale ? 'On Sale!' : 'Regular Price'}
					</Typography>
					<Typography variant='body2' color={available ? 'success.main' : 'error.main'} className='font-medium'>
						{available ? 'In Stock' : 'Out of Stock'}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
				<Button size='small' color='primary' variant='contained'>
					Edit
				</Button>
				<Button size='small' color='secondary' variant='outlined'>
					Delete
				</Button>
			</CardActions>
		</Card>
	)
}

export default AdminProductCard

import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea, CardActions } from '@mui/material'
import { ProductCardProps } from './ProductCard'
import Image from 'next/image'

const AdminProductCard = ({ name, price, rating, onSale, available, imgURL, description }: ProductCardProps) => {
	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardActionArea>
				<div>
					<Image className='object-contain' src={imgURL} fill alt=''></Image>
				</div>
				<CardContent>
					<Typography gutterBottom variant='h5' component='div'>
						{name}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{description}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{price}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{rating}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{onSale}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{available}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size='small' color='primary'>
					Edit
				</Button>
				<Button size='small' color='primary'>
					Delete
				</Button>
			</CardActions>
		</Card>
	)
}

export default AdminProductCard

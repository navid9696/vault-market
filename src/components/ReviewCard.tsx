
import React from 'react'
import { Avatar, Card, CardContent, Rating, styled } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

const StyledRating = styled(Rating)(({ theme }) => ({
	'& .MuiRating-iconFilled': {
		color: theme.palette.primary.main,
		filter: 'drop-shadow(1px 0.75px 0px rgb(0 0 0 / 1))',
	},
	'& .MuiRating-iconEmpty': {
		color: theme.palette.text.secondary,
		fill: theme.palette.background.paper,
	},
}))

interface ReviewCardProps {
	username: string
	userAvatar: string
	comment: string
	rating: number
}

const ReviewCard = ({ username, userAvatar, comment, rating }: ReviewCardProps) => {
	return (
		<Card variant='outlined' className='bg-surface'>
			<CardContent>
				<div className='flex items-center mb-2'>
					<Avatar alt={username} src={userAvatar} className='mr-4' />
					<h2 className='text-text text-xl font-semibold'>{username}</h2>
				</div>
				<p className='text-text mb-2 text-sm'>{comment}</p>
				<div className='flex items-center'>
					<p className='text-text mr-2'>Rating:</p>
					<StyledRating
						emptyIcon={<StarIcon fontSize='inherit' />}
						className='text-base'
						name='read-only'
						value={rating}
						max={5}
						precision={0.25}
						readOnly
					/>
				</div>
			</CardContent>
		</Card>
	)
}

export default ReviewCard

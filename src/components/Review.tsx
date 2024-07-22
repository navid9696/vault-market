import React from 'react'
import { Avatar, Card, CardContent, Rating, styled } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

const StyledRating = styled(Rating)({
	'& .MuiRating-iconFilled': {
		color: '#f1f5f9',
		filter: 'drop-shadow(1px 0.75px 0px rgb(0 0 0 / 1))',
	},
	'& .MuiRating-iconEmpty': {
		color: '#1e293b',
		fill: 'black',
	},
})

interface ReviewProps {
	username: string
	userAvatar: string
	comment: string
	rating: number
}

const Review = ({ username, userAvatar, comment, rating }: ReviewProps) => {
	return (
		<Card variant='outlined' className='w-full'>
			<CardContent>
				<div className='flex items-center mb-2'>
					<Avatar alt={username} src={userAvatar} className='mr-4' />
					<h2 className='text-xl font-semibold'>{username}</h2>
				</div>
				<p className='text-gray-600 mb-2 text-sm'>{comment}</p>
				<div className='flex items-center'>
					<p className='text-black mr-2'>Rating:</p>

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

export default Review

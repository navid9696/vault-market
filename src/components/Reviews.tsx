import { BiCommentAdd as AddReview } from 'react-icons/bi'
import { Button, Box, ListItem } from '@mui/material'
import AutoSizer from 'react-virtualized-auto-sizer'
import Review from './Review'
import { ListChildComponentProps, FixedSizeList as ResponsiveList } from 'react-window'

// Sample review data used temporarily for component creation purposes
const reviewData = [
	{
		username: 'John Doe',
		userAvatar: '',
		comment: 'This is a great product! Highly recommend it.',
		rating: 4.3,
	},
	{
		username: 'Jane Smith',
		userAvatar: '',
		comment: 'Not bad, but there are better options out there.',
		rating: 0.5,
	},
	{
		username: 'John Doe',
		userAvatar: '',
		comment:
			'lorem ipsum dolor sit amet, consectetur adip e justo sed diam non  proident, sed diam non proident du contratibus et justo sed diam non proident et justo sed dilorem ipsum dolor   ',
		rating: 4,
	},
	{
		username: 'Jane Smith',
		userAvatar: '',
		comment: 'Not bad, but there are better options out there.',
		rating: 2.5,
	},
]

function renderRow(props: ListChildComponentProps) {
	const { index, style } = props
	const review = reviewData[index]

	return (
		<ListItem className='p-2 w-full' style={style} key={index} component='div' disablePadding>
			<Review
				username={review.username}
				userAvatar={review.userAvatar}
				comment={review.comment}
				rating={review.rating}
			/>
		</ListItem>
	)
}

const Reviews = () => {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between gap-4'>
				<h3 className='w-full text-left font-semibold md:text-sm text-lg'>REVIEWS</h3>
				<Button size='small' className='min-w-36 text-base' endIcon={<AddReview />}>
					Add Review
				</Button>
			</div>
			<Box sx={{ width: '100%', height: '100dvh', bgcolor: 'background.paper' }}>
				<AutoSizer>
					{({ height, width }) => (
						<ResponsiveList height={height} itemCount={reviewData.length} itemSize={250} width={width}>
							{renderRow}
						</ResponsiveList>
					)}
				</AutoSizer>
			</Box>
		</div>
	)
}

export default Reviews

import { BiCommentAdd as AddReview } from 'react-icons/bi'
import { Button, Box, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

function renderRow(props: ListChildComponentProps) {
	const { index, style } = props

	return (
		<ListItem className='p-2 bg-red-200' style={style} key={index} component='div'>
			<ListItemButton className='p-2 bg-white'>
				<ListItemText primary={`Item ${index + 1}`} />
			</ListItemButton>
		</ListItem>
	)
}

const Reviews = () => {
	return (
		<div className='w-1/3 hidden md:flex flex-col gap-4 '>
			<div className='flex items-center justify-between gap-4'>
				<h3 className='w-full text-left font-semibold text-sm'>REVIEWS</h3>
				<Button size='small' className='min-w-36 text-base' endIcon={<AddReview />}>
					Add Review
				</Button>
			</div>
			<Box sx={{ width: '100%', height: 400, maxWidth: 211, bgcolor: 'background.paper' }}>
				<FixedSizeList height={400} width={211} itemSize={46} itemCount={200} overscanCount={5}>
					{renderRow}
				</FixedSizeList>
			</Box>
		</div>
	)
}

export default Reviews

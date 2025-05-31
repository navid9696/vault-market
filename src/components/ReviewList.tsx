import React, { useCallback, useState } from 'react'
import { BiCommentAdd as AddReview } from 'react-icons/bi'
import { Button, Box, ListItem, Typography } from '@mui/material'
import Review from './ReviewCard'
import TransitionsModal from './TransitionModal'
import CommentForm from './ReviewForm'
import { trpc } from '~/server/client'

interface ReviewListProps {
	productId: string
}

const ReviewList = ({ productId }: ReviewListProps) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [showCommentForm, setShowCommentForm] = useState(false)

	const handleModalOpen = useCallback(() => setModalOpen(true), [])
	const handleModalClose = useCallback(() => setModalOpen(false), [])
	const handleAddReview = useCallback(() => {
		if (window.innerWidth < 768) {
			setShowCommentForm(true)
		} else {
			handleModalOpen()
		}
	}, [handleModalOpen])

	const { data: comments = [], isLoading } = trpc.product.getComments.useQuery(
		{ productId },
		{ enabled: Boolean(productId) }
	)

	if (showCommentForm) {
		return <CommentForm productId={productId} handleClose={() => setShowCommentForm(false)} />
	}

	return (
		<>
			<div className='flex flex-col gap-4'>
				<div className='flex items-center justify-between gap-4'>
					<h3 className='w-full text-left font-semibold md:text-lg text-sm'>REVIEWS</h3>
					<Button onClick={handleAddReview} size='small' className='min-w-36 text-base text-text' endIcon={<AddReview />}>
						Add Review
					</Button>
				</div>
				<Box
					className='bg-tertiary rounded-xl overflow-y-auto p-2'
					sx={{
						width: '70dvw',
						height: '75dvh',
						bgcolor: 'background.paper',
						'@media (min-width: 768px)': { width: '100%' },
					}}>
					{isLoading ? (
						<Typography align='center' sx={{ pt: 4 }}>
							Loading…
						</Typography>
					) : (
						<div className='flex flex-col gap-4'>
							{comments.map(c => (
								<ListItem key={c.id} component='div' disablePadding className='px-2 w-full'>
									<Review
										username={c.authorName}
										userAvatar={c.user?.image ?? ''}
										comment={c.content}
										rating={c.rating}
									/>
								</ListItem>
							))}
						</div>
					)}
				</Box>
			</div>

			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<CommentForm productId={productId} handleClose={handleModalClose} />
			</TransitionsModal>
		</>
	)
}

export default ReviewList

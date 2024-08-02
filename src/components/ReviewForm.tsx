import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, TextField, Typography, InputAdornment, styled, Rating } from '@mui/material'
import { FaAngleRight } from 'react-icons/fa'
import { toast } from 'react-toastify'
import StarIcon from '@mui/icons-material/Star'

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
})

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

const ReviewSchema = z.object({
	review: z
		.string()
		.min(1, { message: 'Review cannot be empty' })
		.max(150, { message: 'Keep your review within 150 characters' }),
	rating: z.number(),
})

interface ReviewFormInput {
	review: string
	rating: number
}

interface ReviewFormProps {
	handleClose: () => void
}

const ReviewForm = ({ handleClose }: ReviewFormProps) => {
	const [isFocusedField, setIsFocusedField] = useState<string | boolean>(false)
	const [rating, setRating] = useState(1)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState,
		formState: { errors },
		clearErrors,
	} = useForm<ReviewFormInput>({
		resolver: zodResolver(ReviewSchema),
	})

	const onSubmit: SubmitHandler<ReviewFormInput> = data => {
		console.log(data)
	}

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			setIsFocusedField(false)
			toast.success('Review submitted successfully')
			setRating(1)
			reset()
		}
	}, [formState, reset])

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<Typography variant='h4' component='h3' gutterBottom>
				Leave a Review
			</Typography>

			<div className='flex flex-wrap justify-center gap-x-5'>
				<Typography gutterBottom variant='h6' component='h4'>
					Share your thoughts with us
				</Typography>
				<TextField
					className='relative w-full'
					multiline
					maxRows={8}
					size='medium'
					{...register('review', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('review')
						},
					})}
					onFocus={() => setIsFocusedField(true)}
					InputProps={{
						startAdornment: isFocusedField && (
							<InputAdornment
								className={`-ml-[14px] top-5 absolute ${isFocusedField && 'input-adornment-enter-active'}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.review}
					id={`filled-basic-review`}
					label='Review'
					variant='filled'
					helperText={<span className='block h-4'>{errors.review?.message}</span>}
				/>
			</div>
			<div className='flex items-center'>
				<p className='text-black mr-2'>Rating:</p>
				<VisuallyHiddenInput type='number' value={rating} readOnly {...register('rating', { valueAsNumber: true })} />
				<StyledRating
					emptyIcon={<StarIcon fontSize='inherit' />}
					className='text-xl'
					precision={1}
					value={rating}
					onChange={(_, newRating) => {
						setRating(newRating || 1)
					}}
				/>
			</div>
			<div className='flex justify-center gap-20 mt-4'>
				<Button onClick={handleClose} size='large'>
					Return
				</Button>
				<Button size='large' type='submit'>
					Submit
				</Button>
			</div>
		</form>
	)
}

export default ReviewForm

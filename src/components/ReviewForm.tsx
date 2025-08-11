import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, TextField, Typography, InputAdornment, styled, Rating } from '@mui/material'
import { FaAngleRight } from 'react-icons/fa'
import StarIcon from '@mui/icons-material/Star'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'

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

const ReviewSchema = z.object({
	review: z.string().min(1).max(150),
	rating: z.number().int().min(0).max(5),
})

interface ReviewFormInput {
	review: string
	rating: number
}

interface ReviewFormProps {
	productId: string
	handleClose: () => void
}

export default function ReviewForm({ productId, handleClose }: ReviewFormProps) {
	const [isFocusedField, setIsFocusedField] = useState(false)
	const [rating, setRating] = useState(1)
	const utils = trpc.useUtils()
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitSuccessful },
	} = useForm<ReviewFormInput>({
		resolver: zodResolver(ReviewSchema),
		defaultValues: { rating: 1 },
	})

	const addComment = trpc.product.addComment.useMutation({
		onSuccess: () => {
			toast.success(
				<div>
					☢️ TERMINAL ENTRY STORED
					<br />
					COMMENT RECEIVED
					<br />
					STATUS: ACCEPTED
				</div>
			)
			utils.product.getComments.invalidate({ productId })
		},
		onError: err => {
			const data = err.data as any
			if (data?.zodError) {
				console.group('Zod validation errors')
				console.table(data.zodError.fieldErrors)
				console.groupEnd()
				toast.error(
					<div>
						⚠️ VALIDATION FAULT
						<br />
						FIELD ERROR DETECTED
						<br />
						STATUS: REJECTED
					</div>
				)
				return
			}
			toast.error(
				<div>
					⚠️ TRANSMISSION FAILED
					<br />
					{err.message}
				</div>
			)
		},
	})

	const onSubmit: SubmitHandler<ReviewFormInput> = data => {
		addComment.mutate({
			productId,
			content: data.review,
			rating: data.rating,
		})
	}

	useEffect(() => {
		if (isSubmitSuccessful && addComment.isSuccess) {
			reset()
			setRating(1)
			handleClose()
		}
	}, [isSubmitSuccessful, addComment.isSuccess, reset, handleClose])

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<Typography variant='h4' component='h3' gutterBottom>
				Add Comment
			</Typography>

			<div className='flex flex-wrap justify-center gap-x-5'>
				<Typography gutterBottom variant='h6' component='h4'>
					Share your thoughts
				</Typography>
				<TextField
					className='relative w-full'
					multiline
					maxRows={8}
					size='medium'
					{...register('review', {
						onBlur: () => setIsFocusedField(false),
					})}
					onFocus={() => setIsFocusedField(true)}
					InputProps={{
						startAdornment: isFocusedField && (
							<InputAdornment className='-ml-[14px] top-5 absolute input-adornment-enter-active' position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.review}
					label='Comment'
					variant='filled'
					helperText={errors.review?.message}
				/>
			</div>

			<div className='flex items-center'>
				<Typography className='mr-2'>Rating:</Typography>
				<VisuallyHiddenInput type='number' {...register('rating', { valueAsNumber: true })} value={rating} readOnly />
				<StyledRating
					emptyIcon={<StarIcon fontSize='inherit' />}
					precision={1}
					value={rating}
					onChange={(_, newValue) => {
						const v = newValue || 1
						setRating(v)
						setValue('rating', v, { shouldValidate: true })
					}}
					className='text-xl'
				/>
			</div>

			<div className='flex justify-center gap-20 mt-4'>
				<Button onClick={handleClose} size='large'>
					Cancel
				</Button>
				<Button size='large' type='submit' disabled={addComment.status === 'pending'}>
					{addComment.status === 'pending' ? 'Submitting...' : 'Submit'}
				</Button>
			</div>
		</form>
	)
}

import { InputAdornment, TextField, Typography, Button } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { SettingFormsProps } from '~/lib/types'

const emailSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Your email address cannot be empty.' })
		.email({ message: 'Please enter a valid email address.' }),
})

interface EmailFormInput {
	email: string
}

const EmailForm = ({ setIsDetailsVisible }: SettingFormsProps) => {
	const [isFocusedField, setIsfocusedField] = useState(false)
	const {
		register,
		handleSubmit,
		reset,
		formState,
		formState: { errors },
		clearErrors,
	} = useForm<EmailFormInput>({
		resolver: zodResolver(emailSchema),
	})

	const onSubmit: SubmitHandler<EmailFormInput> = data => {
		console.log(data)
	}

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			setIsfocusedField(false)
			toast.success('Email updated successfully')
			reset()
		}
	}, [formState, reset])

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<Typography variant='h4' component='h3' gutterBottom>
				Email Update
			</Typography>
			<div className='flex flex-wrap justify-center gap-x-5'>
				<Typography gutterBottom className='mt-10' variant='h6' component='h4'>
					Modify Your Email
				</Typography>
				<TextField
					className='relative w-3/4'
					size='medium'
					{...register('email', {
						onBlur: () => {
							setIsfocusedField(false)
							clearErrors('email')
						},
					})}
					onFocus={() => setIsfocusedField(true)}
					InputProps={{
						startAdornment: isFocusedField && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.email}
					id={`filled-basic-email`}
					label='Email'
					variant='filled'
					helperText={<span className='block h-4'>{errors.email?.message}</span>}
				/>
			</div>
			<div className='flex justify-center gap-20 mt-4'>
				<Button
					size='large'
					onClick={() => {
						setIsDetailsVisible(false)
					}}>
					Return
				</Button>
				<Button size='large' type='submit'>
					Submit
				</Button>
			</div>
		</form>
	)
}

export default EmailForm

import { InputAdornment, TextField, Typography, Button } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { SettingFormsProps } from '~/lib/types'

const passwordSchema = z
	.string()
	.min(8, { message: 'Ensure your password has at least 8 characters.' })
	.max(20, { message: 'Keep your password under 20 characters.' })
	.refine(password => /[A-Z]/.test(password), {
		message: 'Add at least one uppercase letter.',
	})
	.refine(password => /[a-z]/.test(password), {
		message: 'Add at least one lowercase letter.',
	})
	.refine(password => /[0-9]/.test(password), {
		message: 'Add at least one digit.',
	})
	.refine(password => /[!@#$%^&*]/.test(password), {
		message: 'Add at least one special character (!@#$%^&*).',
	})

const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, { message: 'Current password is required' }),
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "The passwords you entered don't match. Please verify and try again.",
		path: ['confirmPassword'],
	})

interface PasswordFormInput {
	currentPassword: string
	password: string
	confirmPassword: string
}

const PasswordForm = ({ setIsDetailsVisible }: SettingFormsProps) => {
	const [isFocusedField, setIsFocusedField] = useState<string | boolean>(false)

	const {
		register,
		handleSubmit,
		reset,
		formState,
		formState: { errors },
		clearErrors,
	} = useForm<PasswordFormInput>({
		resolver: zodResolver(updatePasswordSchema),
	})

	const onSubmit: SubmitHandler<PasswordFormInput> = data => {
		console.log(data)
	}

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			setIsFocusedField(false)
			toast.success('Password updated successfully')
			reset()
		}
	}, [formState, reset])

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<Typography variant='h4' component='h3' gutterBottom>
				Password Update
			</Typography>

			<div className='flex flex-wrap justify-center gap-x-5'>
				<Typography gutterBottom variant='h6' component='h4'>
					Secure Your Account with a New Password
				</Typography>
				<TextField
					className='relative md:w-3/4 w-full'
					size='small'
					{...register('currentPassword', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('currentPassword')
						},
					})}
					onFocus={() => setIsFocusedField('currentPassword')}
					InputProps={{
						startAdornment: isFocusedField === 'currentPassword' && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.currentPassword}
					id='filled-basic-currentPassword'
					label='Current Password'
					variant='filled'
					helperText={<span className='block h-11'>{errors.currentPassword?.message}</span>}
				/>
				<TextField
					className='relative md:w-3/4 w-full'
					size='small'
					{...register('password', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('password')
						},
					})}
					onFocus={() => setIsFocusedField('password')}
					InputProps={{
						startAdornment: isFocusedField === 'password' && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.password}
					id='filled-basic-password'
					label='New Password'
					variant='filled'
					helperText={<span className='block h-11'>{errors.password?.message}</span>}
				/>
				<TextField
					className='relative md:w-3/4 w-full'
					size='small'
					{...register('confirmPassword', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('confirmPassword')
						},
					})}
					onFocus={() => setIsFocusedField('confirmPassword')}
					InputProps={{
						startAdornment: isFocusedField === 'confirmPassword' && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.confirmPassword}
					id='filled-basic-confirmPassword'
					label='Confirm New Password'
					variant='filled'
					helperText={<span className='block h-11'>{errors.confirmPassword?.message}</span>}
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

export default PasswordForm

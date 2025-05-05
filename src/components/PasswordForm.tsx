import { InputAdornment, TextField, Typography, Button } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'
import { SettingFormsProps } from '~/lib/types'
import { updatePasswordSchema } from '~/schemas/passwordSchema'

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
		formState: { errors },
		clearErrors,
	} = useForm<PasswordFormInput>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			currentPassword: '',
			password: '',
			confirmPassword: '',
		},
	})

	const updatePassword = trpc.user.updatePassword.useMutation({
		onSuccess: () => {
			toast.success('Password updated successfully')
			reset()
			setIsDetailsVisible(false)
		},
		onError: err => {
			toast.error(err.message)
		},
	})

	const onSubmit: SubmitHandler<PasswordFormInput> = data => {
		updatePassword.mutate({
			currentPassword: data.currentPassword,
			password: data.password,
			confirmPassword: data.confirmPassword,
		})
	}

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
					type='password'
					{...register('currentPassword', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('currentPassword')
						},
					})}
					onFocus={() => setIsFocusedField('currentPassword')}
					InputProps={{
						startAdornment: isFocusedField === 'currentPassword' && (
							<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
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
					type='password'
					{...register('password', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('password')
						},
					})}
					onFocus={() => setIsFocusedField('password')}
					InputProps={{
						startAdornment: isFocusedField === 'password' && (
							<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
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
					type='password'
					{...register('confirmPassword', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('confirmPassword')
						},
					})}
					onFocus={() => setIsFocusedField('confirmPassword')}
					InputProps={{
						startAdornment: isFocusedField === 'confirmPassword' && (
							<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
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
				<Button size='large' onClick={() => setIsDetailsVisible(false)}>
					Return
				</Button>
				<Button size='large' type='submit' disabled={updatePassword.status === 'pending'}>
					{updatePassword.status === 'pending' ? 'Saving...' : 'Submit'}
				</Button>
			</div>
		</form>
	)
}

export default PasswordForm

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputAdornment, TextField, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { registerSchema, RegisterInput } from '~/schemas/registerSchema'
import { FaAngleRight } from 'react-icons/fa6'
import Link from 'next/link'
import { trpc } from '~/server/client'

const RegisterForm = () => {
	const { navHeight } = useNavigationHeight()
	const [isFocusedField, setIsFocusedField] = useState<string | null>(null)

	const registerMutation = trpc.user.registerUser.useMutation({
		onSuccess: data => {
			toast.success(`Successfully registered as ${data.email}!`)
		},
		onError: error => {
			toast.error(`Registration failed: ${error.message}`)
		},
	})

	const {
		register,
		handleSubmit,
		reset,
		formState,
		formState: { errors },
		clearErrors,
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
	})

	const onSubmit: SubmitHandler<RegisterInput> = data => {
		registerMutation.mutate(data)
	}

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			setIsFocusedField(null)
			reset()
		}
	}, [formState, reset])

	return (
		<div className='h-screen text-white'>
			<div style={{ marginTop: `${navHeight}px` }} className='p-4 h-with-navbar'>
				<form
					className='h-full flex flex-col justify-center items-center text-center'
					onSubmit={handleSubmit(onSubmit)}>
					<h2 className='mb-5 text-3xl'>Sign up for Vault Market</h2>

					<div className='flex flex-wrap justify-center gap-5'>
						<h3 className='text-xl'>Enter your registration details</h3>

						<TextField
							className='relative w-3/4'
							size='medium'
							{...register('email')}
							onFocus={() => setIsFocusedField('email')}
							onBlur={() => {
								setIsFocusedField(null)
								clearErrors('email')
							}}
							error={!!errors.email}
							id='filled-basic-email'
							label='Email'
							variant='filled'
							helperText={<span className='block h-4'>{errors.email?.message}</span>}
							InputProps={{
								startAdornment: isFocusedField === 'email' && (
									<InputAdornment position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>

						<TextField
							className='relative w-3/4'
							size='medium'
							type='password'
							{...register('password')}
							onFocus={() => setIsFocusedField('password')}
							onBlur={() => {
								setIsFocusedField(null)
								clearErrors('password')
							}}
							error={!!errors.password}
							id='filled-basic-password'
							label='Password'
							variant='filled'
							helperText={<span className='block h-4'>{errors.password?.message}</span>}
							InputProps={{
								startAdornment: isFocusedField === 'password' && (
									<InputAdornment position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>

						<TextField
							className='relative w-3/4'
							size='medium'
							type='password'
							{...register('confirmPassword')}
							onFocus={() => setIsFocusedField('confirmPassword')}
							onBlur={() => {
								setIsFocusedField(null)
								clearErrors('confirmPassword')
							}}
							error={!!errors.confirmPassword}
							id='filled-basic-confirm-password'
							label='Confirm Password'
							variant='filled'
							helperText={<span className='block h-4'>{errors.confirmPassword?.message}</span>}
							InputProps={{
								startAdornment: isFocusedField === 'confirmPassword' && (
									<InputAdornment position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>
					</div>

					<div className='flex flex-col justify-center items-center mt-4'>
						<p>
							Already have an account? <Link href={'/login'}>Log in</Link>
						</p>

						<Button className='p-4' size='large' type='submit' disabled={registerMutation.status === 'pending'}>
							{registerMutation.status === 'pending' ? 'Signing up...' : 'Sign Up'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default RegisterForm

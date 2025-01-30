import { z } from 'zod'
import { InputAdornment, TextField, Button } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { loginSchema } from '~/schemas/loginSchema'
import { FaAngleRight } from 'react-icons/fa6'
import Link from 'next/link'

type LoginForm = z.infer<typeof loginSchema>

const LoginForm = () => {
	const { navHeight } = useNavigationHeight()
	const [isFocusedField, setIsFocusedField] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		formState,
		formState: { errors },
		clearErrors,
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit: SubmitHandler<LoginForm> = data => {
		console.log('Login data:', data)
		toast.success('Successfully logged in!')
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
					<h2 className='mb-5 text-3xl'>Log in to Vault Market</h2>

					<div className='flex flex-wrap justify-center gap-5'>
						<h3 className='text-xl'>Enter your login details</h3>

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
					</div>

					<div className='flex flex-col justify-center items-center mt-4'>
						<p>
							Need to create an account? <Link href={'/register'}>Sign up</Link>
						</p>

						<Button className='p-4' size='large' type='submit'>
							Log In
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default LoginForm

'use client'
import { useState, useEffect } from 'react'
import { InputAdornment, TextField, Button } from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { loginSchema } from '~/schemas/loginSchema'
import { FaAngleRight } from 'react-icons/fa6'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import GoogleButton from 'react-google-button'

type LoginFormValues = {
	email: string
	password: string
}

export default function LoginForm() {
	const router = useRouter()
	const { navHeight } = useNavigationHeight()
	const [focused, setFocused] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
		clearErrors,
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	})

	useEffect(() => {
		if (isSubmitSuccessful) {
			setFocused(null)
			reset()
		}
	}, [isSubmitSuccessful, reset])

	const onSubmit: SubmitHandler<LoginFormValues> = async data => {
		const toastId = toast.loading('📡 Connecting to Vault-Tec mainframe...')

		const res = await signIn('credentials', {
			redirect: false,
			email: data.email,
			password: data.password,
		})

		if (!res || res.error) {
			toast.update(toastId, {
				render: '🚫 Authentication failed. Please try again.',
				type: 'error',
				isLoading: false,
				autoClose: 3000,
			})
			return
		}

		toast.update(toastId, {
			render: '🎉 Access granted! Welcome, Vault Dweller!',
			type: 'success',
			isLoading: false,
			autoClose: 1000,
		})

		router.refresh()

		setTimeout(() => {
			if (data.email.trim().toLowerCase() === 'admin@admin.admin') {
				router.push('/admin/dashboard')
			} else {
				router.push('/')
			}
		}, 500)
	}

	return (
		<div className='h-screen text-text'>
			<div style={{ marginTop: `${navHeight}px` }} className='p-4 h-with-navbar'>
				<form
					className='h-full flex flex-col justify-center items-center text-center'
					onSubmit={handleSubmit(onSubmit)}>
					<h2 className='mb-5 text-3xl'>Log in to Vault Market</h2>

					<div className='flex flex-wrap justify-center gap-5'>
						<h3 className='text-xl'>Enter your login details</h3>

						<TextField
							size='medium'
							className='relative w-3/4'
							{...register('email')}
							onFocus={() => setFocused('email')}
							onBlur={() => {
								setFocused(null)
								clearErrors('email')
							}}
							error={!!errors.email}
							label='Email'
							variant='filled'
							helperText={<span className='block h-4'>{errors.email?.message}</span>}
							InputProps={{
								startAdornment: focused === 'email' && (
									<InputAdornment position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>

						<TextField
							size='medium'
							type='password'
							className='relative w-3/4'
							{...register('password')}
							onFocus={() => setFocused('password')}
							onBlur={() => {
								setFocused(null)
								clearErrors('password')
							}}
							error={!!errors.password}
							label='Password'
							variant='filled'
							helperText={<span className='block h-4'>{errors.password?.message}</span>}
							InputProps={{
								startAdornment: focused === 'password' && (
									<InputAdornment position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>
					</div>

					<div className='flex flex-col justify-center items-center mt-4 gap-4'>
						<p>
							Need to create an account?{' '}
							<Link href='/register' className='underline'>
								Sign up
							</Link>
						</p>

						<Button variant='outlined' className='px-4 py-2' size='large' type='submit'>
							Log In
						</Button>

						<p>OR</p>

						<GoogleButton onClick={() => signIn('google')}>Sign in with Google</GoogleButton>
					</div>
				</form>
			</div>
		</div>
	)
}

'use client'
import { useState, useEffect } from 'react'
import { InputAdornment, TextField, Button } from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { registerSchema, RegisterInput } from '~/schemas/registerSchema'
import { FaAngleRight } from 'react-icons/fa6'
import Link from 'next/link'
import { trpc } from '~/server/client'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import GoogleButton from 'react-google-button'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function RegisterForm() {
	const router = useRouter()
	const { navHeight } = useNavigationHeight()
	const [focused, setFocused] = useState<string | null>(null)

	const registerMutation = trpc.user.registerUser.useMutation()

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
		clearErrors,
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
	})

	useEffect(() => {
		if (isSubmitSuccessful) {
			setFocused(null)
			reset()
		}
	}, [isSubmitSuccessful, reset])

	const onSubmit: SubmitHandler<RegisterInput> = async data => {
		const toastId = toast.loading('📡 Registering resident...')
		try {
			await registerMutation.mutateAsync(data)
		} catch {
			toast.update(toastId, {
				render: '❌ Registration failed. Please try again.',
				type: 'error',
				isLoading: false,
				autoClose: 3000,
			})
			return
		}

		toast.update(toastId, { render: '✅ Registration successful. Logging you in...', type: 'success', isLoading: true })
		const res = await signIn('credentials', { redirect: false, email: data.email, password: data.password })

		if (!res || res.error) {
			toast.update(toastId, {
				render: '🚫 Login failed. Please log in manually.',
				type: 'error',
				isLoading: false,
				autoClose: 3000,
			})
			router.push('/login')
			return
		}

		toast.update(toastId, {
			render: '🎉 Logged in successfully! Redirecting...',
			type: 'success',
			isLoading: false,
			autoClose: 1500,
		})
		await sleep(1500)

		router.refresh()
		router.push(data.email === 'admin@admin.admin' ? '/admin/dashboard' : '/')
	}

	return (
		<div className='h-screen max-w-xl text-text'>
			<div style={{ marginTop: `${navHeight}px` }} className='p-4 h-with-navbar'>
				<form
					className='h-full flex flex-col justify-center items-center text-center'
					onSubmit={handleSubmit(onSubmit)}>
					<h2 className='mb-5 text-3xl'>Sign up for Vault Market</h2>

					<div className='flex flex-wrap justify-center gap-1'>
						<h3 className='text-xl'>Enter your registration details</h3>

						<TextField
							size='small'
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
									<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>

						<TextField
							size='small'
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
									<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>

						<TextField
							size='small'
							type='password'
							className='relative w-3/4'
							{...register('confirmPassword')}
							onFocus={() => setFocused('confirmPassword')}
							onBlur={() => {
								setFocused(null)
								clearErrors('confirmPassword')
							}}
							error={!!errors.confirmPassword}
							label='Confirm Password'
							variant='filled'
							helperText={<span className='block h-4'>{errors.confirmPassword?.message}</span>}
							InputProps={{
								startAdornment: focused === 'confirmPassword' && (
									<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>
					</div>

					<div className='flex flex-col justify-center items-center mt-4 gap-2'>
						<p>
							Already have an account?{' '}
							<Link href='/login' className='underline'>
								Log in
							</Link>
						</p>

						<Button
							variant='outlined'
							className='px-4 py-2'
							size='large'
							type='submit'
							disabled={registerMutation.status === 'pending'}>
							{registerMutation.status === 'pending' ? 'Signing up...' : 'Sign Up'}
						</Button>

						<p>OR</p>

						<GoogleButton onClick={() => signIn('google')}>Sign in with Google</GoogleButton>
					</div>
				</form>
			</div>
		</div>
	)
}

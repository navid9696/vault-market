'use client'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { InputAdornment, TextField, Button } from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { loginSchema } from '~/schemas/loginSchema'
import { FaAngleRight } from 'react-icons/fa6'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, SignInResponse, useSession } from 'next-auth/react'
import GoogleButton from 'react-google-button'

type LoginForm = z.infer<typeof loginSchema>

const LoginForm = () => {
	const router = useRouter()
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

	const onSubmit: SubmitHandler<LoginForm> = async data => {
		const signInPromise = new Promise((resolve, reject) => {
			signIn('credentials', {
				redirect: false,
				email: data.email,
				password: data.password,
				callbackUrl: '/',
			}).then(result => {
				if (result && result.error) {
					reject(result.error)
				} else {
					resolve(result)
				}
			})
		})

		await toast
			.promise(signInPromise, {
				pending: '📡 Connecting to Vault-Tec mainframe...',
				success: '🎉 Access granted! Welcome, Vault Dweller!',
				error: '🚫 ERROR: Authentication failure. Please try again.',
			})
			.then(result => {
				const signInResult = result as SignInResponse
				setTimeout(() => {
					router.push(signInResult.url || '/')
				}, 2000)
			})
			.catch((error: unknown) => {
				console.log(error)
			})
	}

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			setIsFocusedField(null)
			reset()
		}
	}, [formState, reset])

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
									<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
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
									<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
										<FaAngleRight />
									</InputAdornment>
								),
							}}
						/>
					</div>

					<div className='flex flex-col justify-center items-center mt-4 gap-4'>
						<p>
							Need to create an account? <Link href={'/register'}>Sign up</Link>
						</p>

						<Button variant='outlined' className='px-4 py-2' size='large' type='submit'>
							Log In
						</Button>
						<p>OR</p>
						<GoogleButton onClick={() => signIn('google', { callbackUrl: '/' })}>Sign in with Google</GoogleButton>
					</div>
				</form>
			</div>
		</div>
	)
}

export default LoginForm

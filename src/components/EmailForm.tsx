// src/components/EmailForm.tsx
import { InputAdornment, TextField, Typography, Button } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { trpc } from '~/server/client'
import { SettingFormsProps } from '~/lib/types'
import { emailSchema } from '~/schemas/emailSchema'

interface EmailFormInput {
	email: string
}

const EmailForm = ({ setIsDetailsVisible }: SettingFormsProps) => {
	const { data: session } = useSession()
	const currentEmail = session?.user?.email ?? ''

	const [isFocusedField, setIsFocusedField] = useState(false)
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitSuccessful },
		clearErrors,
	} = useForm<EmailFormInput>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: currentEmail },
	})

	const updateEmail = trpc.user.updateEmail.useMutation({
		onSuccess: (_result, variables) => {
			toast.success('Email updated successfully')
			reset({ email: variables.email })
			setIsDetailsVisible(false)
		},
		onError: err => {
			toast.error(err.message)
		},
	})

	const onSubmit: SubmitHandler<EmailFormInput> = data => {
		updateEmail.mutate({ email: data.email })
	}

	useEffect(() => {
		if (isSubmitSuccessful && updateEmail.status === 'success') {
			reset({ email: currentEmail })
		}
	}, [isSubmitSuccessful, updateEmail.status, reset, currentEmail])

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<Typography variant='h4' component='h3' gutterBottom>
				Email Update
			</Typography>

			<div className='flex flex-wrap justify-center gap-x-5'>
				<Typography gutterBottom variant='h6' component='h4'>
					Modify Your Email
				</Typography>
				<TextField
					className='relative w-3/4'
					size='medium'
					{...register('email', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('email')
						},
					})}
					onFocus={() => setIsFocusedField(true)}
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
					id='filled-basic-email'
					label='Email'
					variant='filled'
					helperText={errors.email?.message}
				/>
			</div>

			<div className='flex justify-center gap-20 mt-4'>
				<Button size='large' onClick={() => setIsDetailsVisible(false)}>
					Return
				</Button>
				<Button size='large' type='submit' disabled={updateEmail.status === 'pending'}>
					{updateEmail.status === 'pending' ? 'Saving...' : 'Submit'}
				</Button>
			</div>
		</form>
	)
}

export default EmailForm

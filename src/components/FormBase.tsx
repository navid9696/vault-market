import { Button, InputAdornment, TextField, Typography } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler, Resolver } from 'react-hook-form'
import { FaAngleRight } from 'react-icons/fa6'
import { Dispatch, SetStateAction, useState } from 'react'
import { visit } from 'graphql'

interface FormBaseProps {
	title?: string
	subtitle?: string
	fieldName: string
	label: string
	resolver: Resolver<any>
	onSubmitSuccess: (data: any) => void
	children?: React.ReactNode
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
}

const FormBase = ({
	title,
	subtitle,
	label,
	resolver,
	fieldName,
	onSubmitSuccess,
	children,
	setIsDetailsVisible,
}: FormBaseProps) => {
	const [isFocused, setIsFocused] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<any>({
		resolver,
	})

	const onSubmit: SubmitHandler<any> = data => {
		onSubmitSuccess(data)
	}

	return (
		<form className='relative h-full' onSubmit={handleSubmit(onSubmit)}>
			<div>
				<Typography variant='h3' gutterBottom>
					{title}
				</Typography>
				<Typography variant='h6' component='h4' gutterBottom>
					{subtitle}
				</Typography>
			</div>
			<div className=' mt-10'>
				<TextField
					{...register(fieldName, {
						onBlur: () => {
							setIsFocused(false)
							clearErrors(fieldName)
						},
					})}
					onFocus={() => setIsFocused(true)}
					InputProps={{
						startAdornment: (
							<InputAdornment className={`invisible ${isFocused && 'visible'}`} position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors[fieldName]}
					id='filled-basic'
					label={label}
					variant='filled'
					helperText={(errors[fieldName]?.message as string) || ''}
				/>
				{children}
			</div>
			<div className='absolute bottom-0 w-full mx-auto'>
				<Button size='large' className='mr-20' onClick={() => setIsDetailsVisible(false)}>
					Return
				</Button>
				<Button size='large' type='submit'>
					Submit
				</Button>
			</div>
		</form>
	)
}

export default FormBase

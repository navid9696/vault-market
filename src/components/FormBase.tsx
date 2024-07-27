import { InputAdornment, TextField, Typography } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler, Resolver } from 'react-hook-form'
import { FaAngleRight } from 'react-icons/fa6'
import { useState } from 'react'

interface FormData {
	[key: string]: string
}

interface FieldsConf {
	name: string
	label: string
}
interface FormBaseProps {
	title?: string
	subtitle?: string
	size: 'small' | 'medium'
	className: string | undefined
	fields: FieldsConf[]
	resolver: Resolver
	onSubmitSuccess: (data: FormData) => void
	children?: React.ReactNode
}

const FormBase = ({ title, subtitle, size, className, fields, resolver, onSubmitSuccess, children }: FormBaseProps) => {
	const [focusedField, setFocusedField] = useState<string | null>(null)
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<FormData>({
		resolver,
	})

	const onSubmit: SubmitHandler<FormData> = data => {
		onSubmitSuccess(data)
	}

	return (
		<form className='flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<div>
				<Typography variant='h4' component={'h3'} gutterBottom>
					{title}
				</Typography>
				<Typography variant='h6' component='h4' gutterBottom>
					{subtitle}
				</Typography>
			</div>
			<div className='flex flex-wrap justify-center gap-x-5'>
				{fields.map(field => (
					<TextField
						key={field.name}
						className={className}
						size={size}
						{...register(field.name, {
							onBlur: () => {
								setFocusedField(null)
								clearErrors(field.name)
							},
						})}
						onFocus={() => setFocusedField(field.name)}
						InputProps={{
							startAdornment: focusedField === field.name && (
								<InputAdornment className='-ml-[14px] absolute ' position='start'>
									<FaAngleRight />
								</InputAdornment>
							),
						}}
						error={!!errors[field.name]}
						id={`filled-basic-${field.name}`}
						label={field.label}
						variant='filled'
						helperText={<p className='h-12'>{errors[field.name]?.message as string}</p>}
					/>
				))}
			</div>
			{children}
		</form>
	)
}

export default FormBase

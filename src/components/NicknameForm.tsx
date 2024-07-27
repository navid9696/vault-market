import { InputAdornment, TextField, Typography, Button } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { SettingFormsProps } from '~/lib/types'
import { nicknameSchema } from '~/schemas/nicknameSchema'

interface NicknameFormInput {
	nickname: string
}

const NicknameForm = ({ setIsDetailsVisible }: SettingFormsProps) => {
	const [isFocusedField, setIsfocusedField] = useState(false)
	const {
		register,
		handleSubmit,
		reset,
		formState,
		formState: { errors },
		clearErrors,
	} = useForm<NicknameFormInput>({
		resolver: zodResolver(nicknameSchema),
	})

	const onSubmit: SubmitHandler<NicknameFormInput> = data => {
		console.log(data)
	}

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			setIsfocusedField(false)
			toast.success('Nickname updated successfully')
			reset()
		}
	}, [formState, reset])

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<Typography variant='h4' component='h3' gutterBottom>
				Identity Update
			</Typography>

			<div className='flex flex-wrap justify-center gap-x-5'>
				<Typography gutterBottom variant='h6' component='h4'>
					Modify Your Identity
				</Typography>
				<TextField
					className='relative w-3/4'
					size='medium'
					{...register('nickname', {
						onBlur: () => {
							setIsfocusedField(false)
							clearErrors('nickname')
						},
					})}
					onFocus={() => setIsfocusedField(true)}
					InputProps={{
						startAdornment: isFocusedField && (
							<InputAdornment className='-ml-[14px] absolute ' position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.nickname}
					id={`filled-basic-nickname`}
					label='Nickname'
					variant='filled'
					helperText={<span className='block h-4'>{errors.nickname?.message}</span>}
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

export default NicknameForm

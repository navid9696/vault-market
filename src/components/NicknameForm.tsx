import { SettingFormsProps } from '@/lib/types'
import { Button, InputAdornment, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FaAngleRight } from 'react-icons/fa6'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const nicknameSchema = z.object({
	nickname: z
		.string()
		.min(1, { message: 'Name cannot be empty!' })
		.min(5, { message: 'Must be 5 or more characters long' })
		.max(15, { message: 'Must be 15 or fewer characters long' }),
})

interface FormInput {
	nickname: string
}

const NicknameChange = ({ setIsDetailsVisible }: SettingFormsProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<FormInput>({
		resolver: zodResolver(nicknameSchema),
	})

	const onSubmit: SubmitHandler<FormInput> = data => {
		console.log(data)
		toast.success('Nickname updated successfully!')
	}

	return (
		<form className='relative h-full' onSubmit={handleSubmit(onSubmit)}>
			<div>
				<Typography variant='h3' gutterBottom>
					Identity Update
				</Typography>
				<Typography variant='h6' component='h4' gutterBottom>
					Choose a New Identity for the Wasteland
				</Typography>
			</div>
			<div className=' mt-10'>
				<TextField
					{...register('nickname', {
						onBlur: () => clearErrors('nickname'),
					})}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.nickname}
					id='filled-basic'
					label='Nickname'
					variant='filled'
					helperText={errors.nickname?.message}
				/>
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

export default NicknameChange

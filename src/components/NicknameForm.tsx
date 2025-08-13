import { InputAdornment, TextField, Typography, Button, CircularProgress } from '@mui/material'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'
import { type SettingFormsProps } from '~/lib/types'
import { nicknameSchema } from '~/schemas/nicknameSchema'

interface NicknameFormInput {
	nickname: string
}

const NicknameForm = ({ setIsDetailsVisible }: SettingFormsProps) => {
	const utils = trpc.useUtils()
	const { data: name, isLoading } = trpc.user.getUserName.useQuery()
	const defaultName = name?.name ?? ''

	const [isFocusedField, setIsFocusedField] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		clearErrors,
	} = useForm<NicknameFormInput>({
		resolver: zodResolver(nicknameSchema),
		defaultValues: { nickname: '' },
	})

	useEffect(() => {
		reset({ nickname: defaultName })
	}, [defaultName, reset])

	const updateName = trpc.user.updateName.useMutation({
		onSuccess: () => {
			utils.user.getUserName.invalidate()
			toast.success(
				<div>
					☢️ RECORD UPDATED
					<br />
					FIELD: NICKNAME
					<br />
					STATUS: CONFIRMED
				</div>
			)
			setIsDetailsVisible(false)
		},
		onError: () => {
			toast.error(
				<div>
					⚠️ UPDATE FAILED
					<br />
					STATUS: TRY AGAIN
				</div>
			)
		},
	})

	const onSubmit: SubmitHandler<NicknameFormInput> = data => {
		updateName.mutate({ name: data.nickname })
	}

	if (isLoading) return <p>Initializing terminal…</p>

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			<Typography variant='h4' component='h3' gutterBottom>
				Identity Records
			</Typography>

			<div className='flex flex-wrap justify-center gap-x-5'>
				<Typography gutterBottom variant='h6' component='h4'>
					Edit Citizen Handle
				</Typography>
				<TextField
					className='relative w-3/4'
					size='medium'
					{...register('nickname', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('nickname')
						},
					})}
					onFocus={() => setIsFocusedField(true)}
					InputProps={{
						startAdornment: isFocusedField && (
							<InputAdornment className='-ml-[14px] absolute input-adornment-enter-active' position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.nickname}
					label='Nickname'
					variant='filled'
					helperText={errors.nickname?.message}
				/>
			</div>

			<div className='flex justify-center gap-20 mt-4'>
				<Button size='large' onClick={() => setIsDetailsVisible(false)}>
					Cancel
				</Button>
				<Button
					size='large'
					type='submit'
					disabled={updateName.status === 'pending'}
					endIcon={updateName.status === 'pending' ? <CircularProgress size={20} /> : null}
					sx={{
						'&.Mui-disabled': {
							opacity: 0.9,
							backgroundColor: 'primary.main',
							color: 'primary.contrastText',
						},
					}}>
					{updateName.status === 'pending' ? 'Processing…' : 'Save'}
				</Button>
			</div>
		</form>
	)
}

export default NicknameForm

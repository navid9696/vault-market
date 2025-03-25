import {
	InputAdornment,
	TextField,
	Typography,
	Button,
	Select,
	MenuItem,
	SelectChangeEvent,
	InputLabel,
	FormControl,
	FormHelperText,
} from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'
import { statesOfAmerica } from '~/data/statesOfAmerica'
import { SettingFormsProps } from '~/lib/types'
import { addressSchema } from '~/schemas/addressSchema'
import { trpc } from '~/server/client'

export interface AddressFormInput {
	address: string
	addressOptional: string
	city: string
	state: string
	zipCode: string
}

interface AddressFormProps extends Partial<SettingFormsProps> {
	isCheckout?: boolean
	onSuccess?: (data: AddressFormInput) => void
	setIsDetailsVisible?: Dispatch<SetStateAction<boolean>>
}

const AddressForm = ({ setIsDetailsVisible, isCheckout = false, onSuccess }: AddressFormProps) => {
	const [isFocusedField, setIsFocusedField] = useState<string | boolean>(false)
	const [state, setState] = useState('')

	const { data: userData, isLoading: userLoading, refetch } = trpc.user.getAddress.useQuery()

	const handleChange = (event: SelectChangeEvent) => {
		setState(event.target.value)
	}

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		clearErrors,
	} = useForm<AddressFormInput>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			address: '',
			addressOptional: '',
			city: '',
			state: '',
			zipCode: '',
		},
	})

	const updateAddressMutation = trpc.user.updateAddress.useMutation()

	useEffect(() => {
		if (userData) {
			reset({
				address: userData.street || '',
				addressOptional: userData.addressOptional || '',
				city: userData.city || '',
				state: userData.state || '',
				zipCode: userData.zipCode || '',
			})
			setState(userData.state || '')
		}
	}, [userData, reset])

	const onSubmit: SubmitHandler<AddressFormInput> = async data => {
		try {
			await updateAddressMutation.mutateAsync(data)
			toast.success('Address updated successfully')
			refetch()
			if (onSuccess) {
				onSuccess(data)
			}
		} catch (error) {
			toast.error('Error updating address. Please try again.')
		}
	}

	useEffect(() => {
		if (userLoading) return
		if (updateAddressMutation.isSuccess) {
			setIsFocusedField(false)
		}
	}, [updateAddressMutation.isSuccess, userLoading])

	if (userLoading) {
		return <div>Loading user data...</div>
	}

	return (
		<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
			{!isCheckout && (
				<Typography variant='h4' component='h3' gutterBottom>
					Address Update
				</Typography>
			)}
			<div
				onBlur={() => {
					setIsFocusedField(false)
					clearErrors()
				}}
				className='flex flex-wrap justify-center gap-x-5'>
				{!isCheckout && (
					<Typography gutterBottom variant='h6' component='h4'>
						Modify Your Address
					</Typography>
				)}

				<TextField
					className='relative max-w-72 w-full'
					size='small'
					{...register('address', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('address')
						},
					})}
					onFocus={() => setIsFocusedField('address')}
					InputProps={{
						startAdornment: isFocusedField === 'address' && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.address}
					id='filled-basic-address'
					label='Address'
					placeholder='Street address'
					variant='filled'
					helperText={<span className='block h-6'>{errors.address?.message}</span>}
				/>

				<TextField
					className='relative max-w-72 w-full'
					size='small'
					{...register('addressOptional', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('addressOptional')
						},
					})}
					onFocus={() => setIsFocusedField('addressOptional')}
					InputProps={{
						startAdornment: isFocusedField === 'addressOptional' && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.addressOptional}
					id='filled-basic-addressOptional'
					label='Address 2 (Opt)'
					placeholder='Apartment, suite, unit, building'
					variant='filled'
					helperText={<span className='block h-6'>{errors.addressOptional?.message}</span>}
				/>

				<TextField
					className='relative max-w-72 w-full'
					size='small'
					{...register('city', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('city')
						},
					})}
					onFocus={() => setIsFocusedField('city')}
					InputProps={{
						startAdornment: isFocusedField === 'city' && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.city}
					id='filled-basic-city'
					label='City'
					variant='filled'
					helperText={<span className='block h-6'>{errors.city?.message}</span>}
				/>

				<FormControl className='relative max-w-72 w-full text-left' variant='filled' error={!!errors.state}>
					<InputLabel id='demo-simple-select-filled-label'>State</InputLabel>
					{isFocusedField === 'state' && (
						<InputAdornment className='top-4 -left-[2px] absolute' position='start'>
							<FaAngleRight />
						</InputAdornment>
					)}
					<Select
						size='small'
						label='State'
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={state}
						{...register('state', {
							onBlur: () => {
								setIsFocusedField(false)
								clearErrors('state')
							},
							onChange: e => {
								handleChange(e)
							},
						})}
						onFocus={() => setIsFocusedField('state')}>
						{statesOfAmerica.map(stateName => (
							<MenuItem key={stateName} value={stateName}>
								{stateName}
							</MenuItem>
						))}
					</Select>
					<FormHelperText>
						<span className='block h-6'>{errors.state?.message}</span>
					</FormHelperText>
				</FormControl>

				<TextField
					className='relative max-w-72 w-full'
					size='small'
					{...register('zipCode', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('zipCode')
						},
					})}
					onFocus={() => setIsFocusedField('zipCode')}
					InputProps={{
						startAdornment: isFocusedField === 'zipCode' && (
							<InputAdornment
								className={`-ml-[14px] absolute ${isFocusedField ? 'input-adornment-enter-active' : ''}`}
								position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errors.zipCode}
					id='filled-basic-zipCode'
					label='Zip code'
					variant='filled'
					helperText={<span className='block h-6'>{errors.zipCode?.message}</span>}
				/>
			</div>
			{!isCheckout && (
				<div className='flex justify-center gap-20'>
					<Button
						size='large'
						onClick={() => {
							if (setIsDetailsVisible) setIsDetailsVisible(false)
						}}>
						Return
					</Button>
					<Button size='large' type='submit'>
						Submit
					</Button>
				</div>
			)}
		</form>
	)
}

export default AddressForm

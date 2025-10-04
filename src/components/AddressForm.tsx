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
	CircularProgress,
} from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, type SubmitHandler, type UseFormRegister, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaAngleRight } from 'react-icons/fa6'
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'react-toastify'
import { statesOfAmerica } from '~/data/statesOfAmerica'
import { type SettingFormsProps } from '~/lib/types'
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
	register?: UseFormRegister<AddressFormInput>
	errors?: FieldErrors<AddressFormInput>
}

const AddressForm = ({
	setIsDetailsVisible,
	isCheckout = false,
	onSuccess,
	register: externalRegister,
	errors: externalErrors,
}: AddressFormProps) => {
	const [isFocusedField, setIsFocusedField] = useState<string | boolean>(false)
	const [localState, setLocalState] = useState('')

	const { data: userData, isLoading: userLoading, refetch } = trpc.user.getAddress.useQuery()

	const handleChange = (e: SelectChangeEvent) => {
		setLocalState(e.target.value)
	}

	const {
		register: localRegister,
		handleSubmit,
		reset,
		formState: { errors: localErrors },
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
	const isPending = updateAddressMutation.status === 'pending'

	useEffect(() => {
		if (userData) {
			reset({
				address: userData.street || '',
				addressOptional: userData.addressOptional || '',
				city: userData.city || '',
				state: userData.state || '',
				zipCode: userData.zipCode || '',
			})
			setLocalState(userData.state || '')
		}
	}, [userData, reset])

	const onSubmit: SubmitHandler<AddressFormInput> = async data => {
		const toastId = toast.loading(
			<div>
				☢️ ADDRESS TRANSMISSION STARTED
				<br />
				UPDATING CITIZEN RECORD...
			</div>
		)
		try {
			await updateAddressMutation.mutateAsync(data)
			toast.update(toastId, {
				render: (
					<div>
						☢️ RECORD UPDATED
						<br />
						FIELD: ADDRESS
						<br />
						STATUS: CONFIRMED
					</div>
				),
				type: 'success',
				isLoading: false,
				autoClose: 2000,
			})
			await refetch()
			if (onSuccess) onSuccess(data)
			if (setIsDetailsVisible && !isCheckout) setIsDetailsVisible(false)
		} catch {
			toast.update(toastId, {
				render: (
					<div>
						⚠️ UPDATE FAILED
						<br />
						STATUS: TRY AGAIN
					</div>
				),
				type: 'error',
				isLoading: false,
				autoClose: 3000,
			})
		}
	}

	useEffect(() => {
		if (userLoading) return
		if (updateAddressMutation.isSuccess) setIsFocusedField(false)
	}, [updateAddressMutation.isSuccess, userLoading])

	if (userLoading) return <div>Initializing terminal…</div>

	const reg = externalRegister || localRegister
	const errs = externalErrors || localErrors

	const formFields = (
		<>
			{!isCheckout && (
				<Typography variant='h4' component='h3' gutterBottom>
					Address Records
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
						Edit Location Data
					</Typography>
				)}
				<TextField
					className='relative w-full'
					size='small'
					{...reg('address', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('address')
						},
					})}
					onFocus={() => setIsFocusedField('address')}
					InputProps={{
						startAdornment: isFocusedField === 'address' && (
							<InputAdornment className='-ml-[14px] absolute' position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errs.address}
					id='filled-basic-address'
					label='Address'
					placeholder='Street address'
					variant='filled'
					helperText={<span className='block h-6'>{errs.address?.message}</span>}
				/>
				<TextField
					className='relative w-full'
					size='small'
					{...reg('addressOptional', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('addressOptional')
						},
					})}
					onFocus={() => setIsFocusedField('addressOptional')}
					InputProps={{
						startAdornment: isFocusedField === 'addressOptional' && (
							<InputAdornment className='-ml-[14px] absolute' position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errs.addressOptional}
					id='filled-basic-addressOptional'
					label='Address 2 (Opt)'
					placeholder='Apartment, suite, unit, building'
					variant='filled'
					helperText={<span className='block h-6'>{errs.addressOptional?.message}</span>}
				/>
				<TextField
					className='relative w-full'
					size='small'
					{...reg('city', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('city')
						},
					})}
					onFocus={() => setIsFocusedField('city')}
					InputProps={{
						startAdornment: isFocusedField === 'city' && (
							<InputAdornment className='-ml-[14px] absolute' position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errs.city}
					id='filled-basic-city'
					label='City'
					variant='filled'
					helperText={<span className='block h-6'>{errs.city?.message}</span>}
				/>
				<FormControl className='relative w-full text-left' variant='filled' error={!!errs.state}>
					<InputLabel id='demo-simple-select-filled-label'>State</InputLabel>
					{isFocusedField === 'state' && (
						<InputAdornment className='top-4 -left-[2px] absolute' position='start'>
							<FaAngleRight />
						</InputAdornment>
					)}
					<Select
						variant='filled'
						size='small'
						label='State'
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={localState}
						{...reg('state', {
							onBlur: () => {
								setIsFocusedField(false)
								clearErrors('state')
							},
							onChange: e => handleChange(e as SelectChangeEvent),
						})}
						onFocus={() => setIsFocusedField('state')}>
						{statesOfAmerica.map(stateName => (
							<MenuItem key={stateName} value={stateName}>
								{stateName}
							</MenuItem>
						))}
					</Select>
					<FormHelperText>
						<span className='block h-6'>{errs.state?.message}</span>
					</FormHelperText>
				</FormControl>
				<TextField
					className='relative w-full'
					size='small'
					{...reg('zipCode', {
						onBlur: () => {
							setIsFocusedField(false)
							clearErrors('zipCode')
						},
					})}
					onFocus={() => setIsFocusedField('zipCode')}
					InputProps={{
						startAdornment: isFocusedField === 'zipCode' && (
							<InputAdornment className='-ml-[14px] absolute' position='start'>
								<FaAngleRight />
							</InputAdornment>
						),
					}}
					error={!!errs.zipCode}
					id='filled-basic-zipCode'
					label='Zip code'
					variant='filled'
					helperText={<span className='block h-6'>{errs.zipCode?.message}</span>}
				/>
			</div>
		</>
	)

	if (!isCheckout) {
		return (
			<form className='h-full flex flex-col justify-between' onSubmit={handleSubmit(onSubmit)}>
				{formFields}
				<div className='flex justify-center gap-20'>
					<Button
						size='large'
						onClick={() => {
							if (setIsDetailsVisible) setIsDetailsVisible(false)
						}}>
						Cancel
					</Button>
					<Button
						size='large'
						type='submit'
						disabled={isPending}
						aria-busy={isPending}
						endIcon={isPending ? <CircularProgress size={20} /> : null}
						sx={{
							'&.Mui-disabled': {
								opacity: 0.9,
								backgroundColor: 'primary.main',
								color: 'primary.contrastText',
							},
						}}>
						{isPending ? 'Processing…' : 'Save'}
					</Button>
				</div>
			</form>
		)
	}

	return <>{formFields}</>
}

export default AddressForm

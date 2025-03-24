import React, { useState, useEffect } from 'react'
import { trpc } from '~/server/client'
import CartItem from './CartItem'
import {
	CircularProgress,
	Button,
	TextField,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Select,
	MenuItem,
} from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema } from '~/schemas/addressSchema'
import { statesOfAmerica } from '~/data/statesOfAmerica'
import { useNavigationHeight } from '~/context/NavbarHeightContext'

interface AddressFormInput {
	address: string
	addressOptional: string
	city: string
	state: string
	zipCode: string
}

const Checkout = () => {
	const { navHeight } = useNavigationHeight()

	const {
		data: cartData,
		isLoading: cartLoading,
		error: cartError,
		refetch: refetchCart,
	} = trpc.cart.getCartItems.useQuery()

	const { data: addressData, isLoading: addressLoading } = trpc.user.getAddress.useQuery()

	const [shippingMethod, setShippingMethod] = useState<string>('fallout')
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
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

	useEffect(() => {
		if (addressData) {
			reset({
				address: addressData.street || '',
				addressOptional: addressData.addressOptional || '',
				city: addressData.city || '',
				state: addressData.state || '',
				zipCode: addressData.zipCode || '',
			})
		}
	}, [addressData, reset])

	const onSubmit: SubmitHandler<AddressFormInput> = data => {
		console.log('Placing order with shipping method:', shippingMethod, 'and address:', data)
	}

	if (cartLoading || addressLoading) {
		return (
			<div className='flex justify-center mt-4'>
				<CircularProgress />
			</div>
		)
	}
	if (cartError) return <div>Error: {cartError.message}</div>
	if (!cartData || cartData.length === 0) return <div>Your cart is empty.</div>

	const totalAmount = cartData.reduce((sum, item) => {
		const price =
			item.product.discount > 0
				? Math.round(item.product.price * (1 - item.product.discount))
				: Math.round(item.product.price)
		return sum + price * item.quantity
	}, 0)

	return (
		<div style={{ marginTop: `${navHeight}px` }} className='p-4 h-with-navbar bg-white'>
			<h2 className='text-2xl font-bold mb-4'>Checkout</h2>
			<div className='flex flex-col md:flex-row gap-4'>
				<div className='flex-1 max-h-96 overflow-y-auto'>
					{cartData.map(item => (
						<CartItem
							key={item.id}
							product={item.product}
							quantity={item.quantity}
							refetchCart={refetchCart}
							showControls={false}
						/>
					))}
				</div>

				<div className='w-full md:w-1/3'>
					<FormControl>
						<FormLabel
							sx={{
								'&.Mui-focused': { color: '#00d30b' },
							}}
							className='text-green-600 text-lg font-semibold uppercase'
							id='shipping-method-group-label'>
							Shipping Method
						</FormLabel>
						<RadioGroup
							className='flex flex-col gap-2'
							aria-labelledby='shipping-method-group-label'
							name='shipping-method-group'
							value={shippingMethod}
							onChange={e => setShippingMethod(e.target.value)}>
							<FormControlLabel
								value='fallout'
								control={<Radio sx={{ color: '#00a651', '&.Mui-checked': { color: '#00d30b' } }} />}
								label='Fallout Delivery'
							/>
							<FormControlLabel
								value='courier'
								control={<Radio sx={{ color: '#00a651', '&.Mui-checked': { color: '#00d30b' } }} />}
								label='Courier'
							/>
							<FormControlLabel
								value='vertibird'
								control={<Radio sx={{ color: '#00a651', '&.Mui-checked': { color: '#00d30b' } }} />}
								label='Vertibird'
							/>
						</RadioGroup>
					</FormControl>
				</div>
			</div>

			<div className='mt-6'>
				<h3 className='text-xl font-bold mb-2'>Delivery Address</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						fullWidth
						margin='normal'
						label='Address'
						variant='filled'
						{...register('address')}
						error={!!errors.address}
						helperText={errors.address?.message}
					/>
					<TextField
						fullWidth
						margin='normal'
						label='Address 2 (Optional)'
						variant='filled'
						{...register('addressOptional')}
						error={!!errors.addressOptional}
						helperText={errors.addressOptional?.message}
					/>
					<TextField
						fullWidth
						margin='normal'
						label='City'
						variant='filled'
						{...register('city')}
						error={!!errors.city}
						helperText={errors.city?.message}
					/>
					<TextField
						fullWidth
						margin='normal'
						label='State'
						variant='filled'
						{...register('state')}
						error={!!errors.state}
						helperText={errors.state?.message}
					/>
					<TextField
						fullWidth
						margin='normal'
						label='Zip Code'
						variant='filled'
						{...register('zipCode')}
						error={!!errors.zipCode}
						helperText={errors.zipCode?.message}
					/>
					<div className='mt-4 border-t pt-4'>
						<p className='text-lg font-semibold'>Total: ${totalAmount}</p>
					</div>
					<Button type='submit' variant='contained' color='primary' className='mt-4'>
						Place Order
					</Button>
				</form>
			</div>
		</div>
	)
}

export default Checkout

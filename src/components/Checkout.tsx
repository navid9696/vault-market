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
import AddressForm from './AddressForm'
import { GiBottleCap } from 'react-icons/gi'

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

	const [shippingMethod, setShippingMethod] = useState<string>('')

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

	const totalProductsPrice =
		cartData?.reduce((sum, item) => {
			const price =
				item.product.discount > 0
					? Math.round(item.product.price * (1 - item.product.discount))
					: Math.round(item.product.price)
			return sum + price * item.quantity
		}, 0) || 0

	let deliveryPrice = 0
	if (shippingMethod === 'caravan') {
		deliveryPrice = 150
	} else if (shippingMethod === 'courier') {
		deliveryPrice = 500
	} else if (shippingMethod === 'vertibird') {
		deliveryPrice = 1500
	}

	const totalAmount = totalProductsPrice + deliveryPrice

	const handleCheckoutSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Order confirmed with shipping method:', shippingMethod)
		console.log('Products Price:', totalProductsPrice)
		console.log('Delivery Price:', deliveryPrice)
		console.log('Total Amount:', totalAmount)
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

	return (
		<form
			onSubmit={handleCheckoutSubmit}
			style={{ marginTop: `${navHeight}px` }}
			className='p-4 text-green-600 bg-zinc-900'>
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
							sx={{ '&.Mui-focused': { color: '#00d30b' } }}
							className='text-green-600 text-2xl font-bold'
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
								value='caravan'
								control={
									<Radio
										sx={{
											color: '#00a651',
											'&.Mui-checked': { color: '#00d30b' },
										}}
									/>
								}
								label={
									<span className='flex justify-center items-center gap-4'>
										<p>Caravan</p>
										<p className='flex items-center justify-center gap-1'>
											150
											<GiBottleCap />
										</p>
									</span>
								}
							/>

							<FormControlLabel
								value='courier'
								control={<Radio sx={{ color: '#00a651', '&.Mui-checked': { color: '#00d30b' } }} />}
								label={
									<span className='flex justify-center items-center gap-4'>
										<p>Courier</p>
										<p className='flex items-center justify-center gap-1'>
											500
											<GiBottleCap />
										</p>
									</span>
								}
							/>
							<FormControlLabel
								value='vertibird'
								control={<Radio sx={{ color: '#00a651', '&.Mui-checked': { color: '#00d30b' } }} />}
								label={
									<span className='flex justify-center items-center gap-4'>
										<p>Vertibird</p>
										<p className='flex items-center justify-center gap-1'>
											1500
											<GiBottleCap />
										</p>
									</span>
								}
							/>
						</RadioGroup>
					</FormControl>
				</div>
			</div>
			<div className='flex flex-col sm:flex-row'>
				<div className='sm:w-1/2 p-4'>
					<h2 className='text-2xl font-bold mb-2'>Delivery Address</h2>
					<AddressForm isCheckout />
				</div>
				<div className='sm:w-1/2 p-4 flex flex-col  '>
					<h2 className='text-2xl font-bold mb-2'>Summary</h2>
					<div className=''>
						<p className='text-lg font-semibold'>Products Price: ${totalProductsPrice}</p>
						<p className='text-lg font-semibold my-4'>Delivery Price: ${deliveryPrice}</p>
						<p className='text-lg font-semibold'>Total Price: ${totalAmount}</p>
					</div>

					<Button className='w-fit mt-4 p-2' type='submit' variant='contained' color='primary'>
						Confirm Transaction
					</Button>
				</div>
			</div>
		</form>
	)
}

export default Checkout

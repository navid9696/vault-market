import React, { useState, useEffect } from 'react'
import { trpc } from '~/server/client'
import CartItem from './CartItem'
import { CircularProgress, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import AddressForm, { AddressFormInput } from './AddressForm'
import { GiBottleCap } from 'react-icons/gi'
import ConfirmationModal from './ConfirmationModal'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema } from '~/schemas/addressSchema'
import TransitionsModal from './TransitionModal'
import { toast } from 'react-toastify'

const Checkout = () => {
	const { navHeight } = useNavigationHeight()

	const {
		data: cartData,
		isLoading: cartLoading,
		error: cartError,
		refetch: refetchCart,
	} = trpc.cart.getCartItems.useQuery()
	const { data: addressData, isLoading: addressLoading } = trpc.user.getAddress.useQuery()
	const updateAddressMutation = trpc.user.updateAddress.useMutation()
	const [shippingMethod, setShippingMethod] = useState<string>('caravan')
	const [originalAddress, setOriginalAddress] = useState<AddressFormInput | null>(null)
	const [currentAddress, setCurrentAddress] = useState<AddressFormInput | null>(null)
	const [modalOpen, setModalOpen] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<AddressFormInput>({
		resolver: zodResolver(addressSchema),
		defaultValues: { address: '', addressOptional: '', city: '', state: '', zipCode: '' },
	})

	useEffect(() => {
		if (addressData) {
			const defaultAddress: AddressFormInput = {
				address: addressData.street || '',
				addressOptional: addressData.addressOptional || '',
				city: addressData.city || '',
				state: addressData.state || '',
				zipCode: addressData.zipCode || '',
			}
			reset(defaultAddress)
			setOriginalAddress(defaultAddress)
			setCurrentAddress(defaultAddress)
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

	const getDeliveryPrice = (method: string): number => {
		switch (method) {
			case 'caravan':
				return 150
			case 'courier':
				return 500
			case 'vertibird':
				return 1500
			default:
				return 0
		}
	}

	const deliveryPrice = getDeliveryPrice(shippingMethod)
	const totalAmount = totalProductsPrice + deliveryPrice

	const submitOrder = (address: AddressFormInput | null) => {
		console.log('Order confirmed with shipping method:', shippingMethod)
		console.log('Address:', address)
		console.log('Products Price:', totalProductsPrice)
		console.log('Delivery Price:', deliveryPrice)
		console.log('Total Amount:', totalAmount)
	}

	const onSubmit: SubmitHandler<AddressFormInput> = data => {
		if (originalAddress && JSON.stringify(data) !== JSON.stringify(originalAddress)) {
			handleOpen()
		} else {
			submitOrder(data)
		}
	}

	const handleCheckoutSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		handleSubmit(onSubmit)()
	}

	const handleModalConfirm = async () => {
		const data = getValues()
		try {
			await updateAddressMutation.mutateAsync(data)
			toast.success('Address updated successfully')
			handleModalClose()
			submitOrder(data)
		} catch (error) {
			toast.error('Error updating address. Please try again.')
		}
	}

	const handleModalCancel = () => {
		handleModalClose()
		const data = getValues()
		submitOrder(data)
	}

	const handleOpen = () => {
		setModalOpen(true)
	}

	const handleModalClose = () => {
		setModalOpen(false)
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
		<>
			<form
				style={{ marginTop: `${navHeight}px` }}
				className='p-4 bg-white text-green-600'
				onSubmit={handleCheckoutSubmit}>
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
							<FormLabel className='text-green-600 text-2xl font-bold' id='shipping-method-group-label'>
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
									control={<Radio sx={{ color: '#00a651', '&.Mui-checked': { color: '#00d30b' } }} />}
									label={
										<span className='flex justify-center items-center gap-4'>
											<p>Caravan</p>
											<p className='flex items-center justify-center gap-1'>
												150 <GiBottleCap />
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
												500 <GiBottleCap />
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
												1500 <GiBottleCap />
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
						<AddressForm isCheckout onSuccess={data => setCurrentAddress(data)} register={register} errors={errors} />
					</div>
					<div className='sm:w-1/2 p-4 flex flex-col'>
						<h2 className='text-2xl font-bold mb-2'>Summary</h2>
						<div>
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
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<ConfirmationModal onConfirm={handleModalConfirm} onCancel={handleModalCancel} />
			</TransitionsModal>
		</>
	)
}

export default Checkout

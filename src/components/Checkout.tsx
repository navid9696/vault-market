import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { trpc } from '~/server/client'
import CartItem from './CartItem'
import { CircularProgress, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import AddressForm, { AddressFormInput } from './AddressForm'
import { GiBottleCap } from 'react-icons/gi'
import ConfirmationModal from './ConfirmationModal'
import TransitionsModal from './TransitionModal'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema } from '~/schemas/addressSchema'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const Checkout = () => {
	const router = useRouter()
	const { status } = useSession()
	const { navHeight } = useNavigationHeight()

	const {
		data: cartData,
		isLoading: cartLoading,
		isFetching: cartFetching,
		isFetched: cartFetched,
		error: cartError,
		refetch: refetchCart,
	} = trpc.cart.getCartItems.useQuery(undefined, {
		enabled: status === 'authenticated',
		retry: f => f < 2,
		refetchOnWindowFocus: false,
		refetchOnMount: 'always',
	})

	const { data: addressData, isLoading: addressLoading, refetch: refetchAddress } = trpc.user.getAddress.useQuery()
	const createOrderMutation = trpc.orders.createOrder.useMutation()
	const updateAddressMutation = trpc.user.updateAddress.useMutation()
	const clearCartMutation = trpc.cart.clearCart.useMutation()
	const spendCapsMutation = trpc.exchange.spendCaps.useMutation()
	const utils = trpc.useContext()

	const [shippingMethod, setShippingMethod] = useState<string>('caravan')
	const [originalAddress, setOriginalAddress] = useState<AddressFormInput | null>(null)
	const [currentAddress, setCurrentAddress] = useState<AddressFormInput | null>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [transactionSuccess, setTransactionSuccess] = useState(false)

	const {
		handleSubmit,
		reset,
		getValues,
		watch,
		register,
		formState: { errors },
	} = useForm<AddressFormInput>({
		resolver: zodResolver(addressSchema),
		defaultValues: { address: '', addressOptional: '', city: '', state: '', zipCode: '' },
	})

	useEffect(() => {
		const subscription = watch(value => {
			const newAddress: AddressFormInput = {
				address: value.address ?? '',
				addressOptional: value.addressOptional ?? '',
				city: value.city ?? '',
				state: value.state ?? '',
				zipCode: value.zipCode ?? '',
			}
			setCurrentAddress(newAddress)
		})
		return () => subscription.unsubscribe()
	}, [watch])

	useEffect(() => {
		if (addressData) {
			const defaultAddress: AddressFormInput = {
				address: addressData.street ?? '',
				addressOptional: addressData.addressOptional ?? '',
				city: addressData.city ?? '',
				state: addressData.state ?? '',
				zipCode: addressData.zipCode ?? '',
			}
			reset(defaultAddress)
			setOriginalAddress(defaultAddress)
			setCurrentAddress(defaultAddress)
		}
	}, [addressData, reset])

	const totalProductsPrice =
		cartData?.reduce((sum: number, item: (typeof cartData)[number]) => {
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

	const submitOrder = async (address: AddressFormInput, opts?: { addressUpdated?: boolean }) => {
		const orderItems =
			cartData?.map((item: (typeof cartData)[number]) => ({
				productId: item.product.id,
				name: item.product.name,
				price:
					item.product.discount > 0
						? Math.round(item.product.price * (1 - item.product.discount))
						: Math.round(item.product.price),
				quantity: item.quantity,
			})) || []

		const payload = {
			shippingMethod,
			address: {
				street: address.address,
				addressOptional: address.addressOptional,
				city: address.city,
				state: address.state,
				zipCode: address.zipCode,
			},
			orderDate: new Date(),
			totalAmount,
			orderItems,
		}

		try {
			await spendCapsMutation.mutateAsync({ amount: totalAmount })
			await createOrderMutation.mutateAsync(payload)

			await clearCartMutation.mutateAsync({})
			await Promise.all([refetchCart(), utils.cart.getTotalItems.invalidate()])

			toast.success(
				<div>
					☢️ TRANSACTION COMPLETE
					{opts?.addressUpdated && (
						<>
							<br />
							ADDRESS UPDATED
						</>
					)}
					<br />
					CAPS DEDUCTED: {totalAmount}
					<br />
					STATUS: CONFIRMED
				</div>,
				{ autoClose: 4000 },
			)

			setTransactionSuccess(true)
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

			setTimeout(() => {
				router.push('/')
			}, 5100)
		} catch (error: any) {
			console.error('Checkout transaction error', error)
			const rawMessage = error?.message ?? String(error ?? '')
			const friendlyMessage = rawMessage.includes('JSON')
				? 'Server response was invalid. Please try again.'
				: rawMessage.includes('Not authenticated')
					? 'You must be logged in to complete this purchase.'
					: rawMessage.includes('Not enough caps')
						? 'Not enough caps available to complete this purchase.'
						: rawMessage || 'Something went wrong. Please try again.'

			toast.error(
				<div>
					⚠️ TRANSACTION FAILED
					<br />
					{friendlyMessage}
				</div>,
				{ autoClose: 4000 },
			)
		}
	}

	const onSubmit: SubmitHandler<AddressFormInput> = data => {
		if (!originalAddress) {
			handleOpen()
			return
		}

		const isChanged = JSON.stringify(data) !== JSON.stringify(originalAddress)
		if (isChanged) {
			handleOpen()
			return
		}

		submitOrder(data)
	}

	const handleModalConfirm = async () => {
		const data = getValues()
		try {
			await updateAddressMutation.mutateAsync(data)
			await refetchAddress()
			handleModalClose()
			await submitOrder(data, { addressUpdated: true })
		} catch {
			toast.error(
				<div>
					⚠️ ADDRESS UPDATE FAILED
					<br />
					PLEASE TRY AGAIN
				</div>,
				{ autoClose: 3500 },
			)
		}
	}
	const handleModalCancel = () => {
		handleModalClose()
	}

	const handleOpen = () => {
		setModalOpen(true)
	}

	const handleModalClose = () => {
		setModalOpen(false)
	}

	if (status === 'loading') {
		return (
			<div className='flex justify-center mt-4'>
				<CircularProgress />
			</div>
		)
	}

	if (status !== 'authenticated') {
		return (
			<div className='text-center p-8'>
				<p className='text-2xl font-semibold'>Please log in to access checkout.</p>
			</div>
		)
	}

	const cartStillLoading = !cartFetched || cartLoading || cartFetching
	if (cartStillLoading || addressLoading) {
		return (
			<div className='flex justify-center mt-4'>
				<CircularProgress />
			</div>
		)
	}

	if (transactionSuccess) {
		return (
			<div className='relative h-screen w-screen bg-bg'>
				<div className='flex md:hidden absolute inset-0 items-center justify-center'>
					<CircularProgress size={80} />
				</div>
				<div className='hidden md:block absolute inset-0'>
					<Image
						src='/imgs/pleaseStandBy.webp'
						alt='Please Stand By'
						fill
						sizes='(max-width: 768px) 100vw, 70vw'
						className='object-cover xl:object-contain'
						priority
					/>
				</div>
			</div>
		)
	}

	if (cartError) return <div>Error: {cartError.message}</div>
	if (!cartData || cartData.length === 0) return <div className='text-4xl'>Your cart is empty.</div>

	return (
		<>
			<form style={{ marginTop: `${navHeight}px` }} className='p-4 bg-bg text-text' onSubmit={handleSubmit(onSubmit)}>
				<h2 className='text-2xl font-bold mb-4'>Checkout</h2>
				<div className='flex flex-col md:flex-row gap-4'>
					<div className='flex-1 max-h-96 overflow-y-auto'>
						{cartData.map((item: (typeof cartData)[number]) => (
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
							<FormLabel className='text-text text-2xl font-bold' id='shipping-method-group-label'>
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
									control={<Radio />}
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
									control={<Radio />}
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
									control={<Radio />}
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

import { Button, Box, Typography } from '@mui/material'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone'
import SecurityTwoToneIcon from '@mui/icons-material/SecurityTwoTone'
import { GiBottleCap as Caps } from 'react-icons/gi'
import QuantitySelector from './QuantitySelector'
import { useState } from 'react'
import { trpc } from '~/server/client'
import { toast } from 'react-toastify'
import useStore from '~/store/useStore'
import { ensureGuestId } from '~/lib/guestId'

const PriceSection = () => {
	const utils = trpc.useUtils()
	const product = useStore(state => state.product)
	const setProduct = useStore(state => state.setProduct)
	const [selectedQuantity, setSelectedQuantity] = useState(1)

	if (!product) return null

	const addCartItemMutation = trpc.cart.addCartItem.useMutation({
		onSuccess: async (_, vars) => {
			toast.success(
				<div>
					☢️ ACQUISITION QUEUED
					<br />+ {selectedQuantity} x {product.name}
					<br />
					STATUS: ACCEPTED
				</div>,
			)
			setProduct({ ...product, available: product.available - selectedQuantity })
			if (vars.gid) {
				await Promise.all([
					utils.cart.getTotalItems.invalidate({ gid: vars.gid }),
					utils.cart.getCartItems.invalidate({ gid: vars.gid }),
				])
			}
			await Promise.all([utils.cart.getTotalItems.invalidate(), utils.cart.getCartItems.invalidate()])
		},
		onError: () => {
			toast.error(
				<div>
					⚠️ TERMINAL ERROR
					<br />
					REQUEST REJECTED
				</div>,
			)
		},
	})

	const handleAddToCart = () => {
		const gid = ensureGuestId()
		addCartItemMutation.mutate({
			productId: product.id,
			quantity: selectedQuantity,
			gid,
		})
	}

	return (
		<Box className='w-full sm:w-6/12  md:w-[44%] lg:w-1/2 mt-0  flex flex-col items-center justify-center md:items-start lg:items-center gap-3 md:gap-4 lg:gap-6 text-text'>
			<Box className='w-full rounded-xl shadow-inset-1 p-3 md:p-4 lg:p-0 lg:shadow-none lg:rounded-none'>
				<Typography className='w-full text-left font-semibold text-base md:text-lg lg:text-lg tracking-wide'>
					PRICE
				</Typography>
				<Box className='w-full mt-2 flex items-end gap-x-4 justify-start sm:gap-4'>
					<Typography className='flex items-center gap-1 lg:text-2xl text-2xl leading-none font-bold'>
						{(product.price * (1 - product.discount)).toFixed(0)}
						<Caps />
					</Typography>
					{!!product.discount && (
						<Typography className='flex items-center gap-1 line-through lg:text-base text-sm decoration-red-500 decoration-2 opacity-80'>
							{product.price}
							<Caps />
						</Typography>
					)}
				</Box>
			</Box>
			<div className='w-full rounded-xl shadow-inset-1 p-3 md:p-4 lg:p-0 lg:shadow-none lg:rounded-none flex flex-col items-center md:items-start gap-2'>
				<Typography className='w-full text-left text-sm md:text-base lg:text-base font-semibold'>QUANTITY</Typography>
				<QuantitySelector
					selectedQuantity={selectedQuantity}
					setSelectedQuantity={setSelectedQuantity}
					availability={product.available}
					strictLimit
				/>
				<Typography className='text-xs md:text-sm text-center md:text-left opacity-85'>
					In stock: {product.available}
				</Typography>
			</div>
			<Box className='w-full rounded-xl shadow-inset-1 p-3 md:p-4 lg:p-0 lg:shadow-none lg:rounded-none flex flex-col gap-2 items-center md:items-start'>
				<Typography className='w-full text-left text-sm md:text-base lg:text-base font-semibold'>PROTECTION</Typography>
				<Typography className='text-xs lg:text-sm w-full text-left'>30-day returns</Typography>
				<Typography className='text-xs lg:text-sm w-full text-left'>Manufacturer warranty</Typography>
				<Box className='w-full flex items-center gap-1 text-xs lg:text-sm'>
					<SecurityTwoToneIcon fontSize='small' />
					<Typography>Secure transaction</Typography>
				</Box>
			</Box>
			<Button
				className='w-full mb-4 lg:w-auto sm:text-2xl text-base text-text mt-1 md:mt-2 lg:mt-4 py-2'
				variant='contained'
				onClick={handleAddToCart}
				disabled={addCartItemMutation.status === 'pending'}
				endIcon={<AddShoppingCartTwoToneIcon fontSize='inherit' />}>
				{addCartItemMutation.status === 'pending' ? 'Adding...' : 'add to cart'}
			</Button>
		</Box>
	)
}

export default PriceSection

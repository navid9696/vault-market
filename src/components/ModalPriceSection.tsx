import { Button, Box, Typography } from '@mui/material'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone'
import SecurityTwoToneIcon from '@mui/icons-material/SecurityTwoTone'
import { GiBottleCap as Caps } from 'react-icons/gi'
import QuantitySelector from './QuantitySelector'
import { useState } from 'react'
import { trpc } from '~/server/client'
import { toast } from 'react-toastify'
import useStore from '~/store/useStore'

const PriceSection = () => {
	const utils = trpc.useUtils()
	const product = useStore(state => state.product)
	const setProduct = useStore(state => state.setProduct)
	const [selectedQuantity, setSelectedQuantity] = useState(1)

	if (!product) return null

	const addCartItemMutation = trpc.cart.addCartItem.useMutation({
		onSuccess: () => {
			toast.success(
				<div>
					☢️ ACQUISITION QUEUED
					<br />+ {selectedQuantity} × {product.name}
					<br />
					STATUS: ACCEPTED
				</div>
			)
			setProduct({ ...product, available: product.available - selectedQuantity })
			utils.cart.getTotalItems.invalidate()
		},
		onError: () => {
			toast.error(
				<div>
					⚠️ TERMINAL ERROR
					<br />
					REQUEST REJECTED
				</div>
			)
		},
	})

	const handleAddToCart = () => {
		addCartItemMutation.mutate({
			productId: product.id,
			quantity: selectedQuantity,
		})
	}

	return (
		<Box className='mt-24 w-1/2 flex flex-col justify-around items-center'>
			<Box className='sm:w-full flex flex-col items-center text-text'>
				<Typography className='w-full text-left font-semibold text-lg'>PRICE</Typography>
				<Box className='w-full flex flex-col sm:flex-row justify-start gap-4'>
					<Typography className='flex items-center gap-1 md:text-2xl text-xl'>
						{(product.price * (1 - product.discount)).toFixed(0)}
						<Caps />
					</Typography>
					{!!product.discount && (
						<Typography className='flex items-center gap-1 line-through md:text-base text-sm decoration-red-500 decoration-2'>
							{product.price}
							<Caps />
						</Typography>
					)}
				</Box>
			</Box>
			<div>
				<QuantitySelector
					selectedQuantity={selectedQuantity}
					setSelectedQuantity={setSelectedQuantity}
					availability={product.available}
					strictLimit
				/>
				<Typography className='text-xs'>on stock {product.available}</Typography>
			</div>

			<Box className='flex flex-col gap-4 items-center '>
				<Typography className='text-xs'>30-day returns</Typography>
				<Typography className='text-xs'>Manufacturer’s warranty</Typography>
				<Box className='flex items-center gap-1 text-xs'>
					<SecurityTwoToneIcon fontSize='small' />
					<Typography>Secure transaction</Typography>
				</Box>
			</Box>

			<Button
				className='sm:text-2xl text-base text-text mt-4'
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

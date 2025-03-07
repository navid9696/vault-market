import { Button } from '@mui/material'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone'
import ShoppingCartCheckoutTwoToneIcon from '@mui/icons-material/ShoppingCartCheckoutTwoTone'
import { GiBottleCap as Caps } from 'react-icons/gi'
import QuantitySelector from './QuantitySelector'
import Link from 'next/link'
import { useState } from 'react'
import { trpc } from '~/server/client'
import { toast } from 'react-toastify'
import useStore from '~/store/useStore'

const PriceSection = () => {
	const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

	const product = useStore(state => state.product)

	if (!product) return null

	const addCartItemMutation = trpc.cart.addCartItem.useMutation({
		onSuccess: () => {
			toast.success('Item added to cart!')
		},
		onError: (error: unknown) => {
			console.error('Error adding to cart', error)
			toast.error('Error adding item. Please try again.')
		},
	})

	const handleAddToCart = () => {
		addCartItemMutation.mutate({
			productId: product.id,
			quantity: selectedQuantity,
		})
	}

	return (
		<div className='w-1/2 flex flex-col justify-evenly items-center'>
			<div className='sm:w-full flex flex-col items-center text-green-950'>
				<h3 className='w-full text-left font-semibold text-sm'>PRICE</h3>
				<div className='w-full flex flex-col sm:flex-row justify-start gap-4'>
					<p className='flex items-center gap-1 md:text-2xl text-xl'>
						{product.price}
						<Caps />
					</p>
					{!!product.discount && (
						<p className='flex items-center gap-1 line-through md:text-base text-sm decoration-red-500 decoration-2'>
							{(product.price / (1 - product.discount)).toFixed(0)}
							<Caps />
						</p>
					)}
				</div>
			</div>
			<div>
				<QuantitySelector />
				<p className='text-xs'>in stock {product.available}</p>
			</div>
			<div className='flex flex-col gap-4'>
				<Button
					className='text-base'
					onClick={handleAddToCart}
					disabled={addCartItemMutation.status === 'pending'}
					endIcon={<AddShoppingCartTwoToneIcon />}>
					{addCartItemMutation.status === 'pending' ? 'Adding...' : 'add to cart'}
				</Button>
				<Link href={'/cart'}>
					<Button className='text-base' endIcon={<ShoppingCartCheckoutTwoToneIcon />}>
						buy now
					</Button>
				</Link>
			</div>
		</div>
	)
}

export default PriceSection

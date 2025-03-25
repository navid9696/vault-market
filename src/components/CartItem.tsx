import React, { useCallback, useState } from 'react'
import { trpc } from '~/server/client'
import QuantitySelector from './QuantitySelector'
import { Button, IconButton } from '@mui/material'
import { ProductCardProps } from './ProductCard'
import Image from 'next/image'
import { BiTrash } from 'react-icons/bi'
import TransitionsModal from './TransitionModal'
import ProductModal from './ProductModal'
import useStore from '~/store/useStore'

interface CartItemProps {
	product: ProductCardProps
	quantity: number
	refetchCart: () => void
	showControls?: boolean
}

const CartItem = ({ product, quantity, refetchCart, showControls = true }: CartItemProps) => {
	const [modalOpen, setModalOpen] = useState(false)
	const setProduct = useStore(state => state.setProduct)
	const utils = trpc.useUtils()

	const handleOpen = useCallback(async () => {
		const updatedProduct = await utils.product.getById.fetch({ id: product.id })
		setProduct(updatedProduct)
		setModalOpen(true)
	}, [product.id, setProduct, utils.product])

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
		utils.favorite.getFavorites.invalidate()
	}, [utils.favorite])

	const updateMutation = trpc.cart.updateCartItem.useMutation({
		onSuccess: () => {
			refetchCart()
			utils.cart.getTotalItems.invalidate()
		},
	})

	const removeMutation = trpc.cart.removeCartItem.useMutation({
		onSuccess: () => {
			refetchCart()
			utils.cart.getTotalItems.invalidate()
		},
	})

	const handleQuantityChange = (newQuantity: number) => {
		const maxAvailable = product.available + quantity
		if (newQuantity < 1 || newQuantity > maxAvailable) return
		updateMutation.mutate({ productId: product.id, quantity: newQuantity })
	}

	const handleRemove = () => {
		removeMutation.mutate({ productId: product.id })
	}

	const displayPrice =
		product.discount > 0 ? Math.round(product.price * (1 - product.discount)) : Math.round(product.price)

	return (
		<>
			<div
				className={`border p-2 mb-2 mr-2 flex ${
					showControls && `sm:flex-row flex-col`
				} items-center justify-between gap-4`}>
				<div
					onClick={handleOpen}
					className={`w-full cursor-pointer ${
						!showControls && 'flex flex-col sm:flex-row items-center justify-start gap-x-4'
					} `}>
					<div className='relative flex justify-center items-center'>
						<Image className='object-contain' src={product.imgURL} width={75} height={200} alt='Product Image' />
					</div>
					<h2 className=' text-xl font-bold text-center'>{product.name}</h2>
				</div>
				{showControls ? (
					<div className='flex flex-col sm:flex-row items-center sm:items-start gap-x-1'>
						<div className='flex flex-col items-center justify-center'>
							<QuantitySelector
								selectedQuantity={quantity}
								setSelectedQuantity={handleQuantityChange}
								availability={product.available}
							/>
							<p>Price: {displayPrice}</p>
						</div>
						<IconButton size='large' color='error' onClick={handleRemove}>
							<BiTrash />
						</IconButton>
					</div>
				) : (
					<div className='w-full flex gap-4 text-xl justify-center items-center text-center'>
						<p>{quantity}</p>
						<p>x</p>
						<p>Price: {displayPrice}</p>
					</div>
				)}
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<ProductModal />
			</TransitionsModal>
		</>
	)
}

export default CartItem

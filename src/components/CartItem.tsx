import React, { useCallback, useState, useEffect, useRef } from 'react'
import { trpc } from '~/server/client'
import QuantitySelector from './QuantitySelector'
import { IconButton } from '@mui/material'
import { ProductCardProps } from './ProductCard'
import Image from 'next/image'
import { BiTrash } from 'react-icons/bi'
import TransitionsModal from './TransitionModal'
import ProductModal from './ProductModal'
import useStore from '~/store/useStore'
import { ensureGuestId } from '~/lib/guestId'

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
	const [gid] = useState(() => ensureGuestId())
	const [localQuantity, setLocalQuantity] = useState(quantity)
	const debounceTimeout = useRef<NodeJS.Timeout>()

	const handleOpen = useCallback(async () => {
		const updatedProduct = await utils.product.getById.fetch({ id: product.id })
		setProduct(updatedProduct)
		setModalOpen(true)
	}, [product.id, setProduct, utils.product])

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
		utils.favorite.getFavorites.invalidate()
	}, [utils.favorite])

	useEffect(() => {
		setLocalQuantity(quantity)
	}, [quantity])

	useEffect(() => {
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current)
			}
		}
	}, [])

	const updateMutation = trpc.cart.updateCartItem.useMutation({
		onSuccess: async (_, vars) => {
			if (vars?.gid) {
				await Promise.all([
					utils.cart.getTotalItems.invalidate({ gid: vars.gid }),
					utils.cart.getCartItems.invalidate({ gid: vars.gid }),
				])
			}
			await Promise.all([utils.cart.getTotalItems.invalidate(), utils.cart.getCartItems.invalidate()])
		},
		onError: () => {
			setLocalQuantity(quantity)
		},
	})

	const removeMutation = trpc.cart.removeCartItem.useMutation({
		onSuccess: async (_, vars) => {
			refetchCart()
			if (vars?.gid) {
				await Promise.all([
					utils.cart.getTotalItems.invalidate({ gid: vars.gid }),
					utils.cart.getCartItems.invalidate({ gid: vars.gid }),
				])
			}
			await Promise.all([utils.cart.getTotalItems.invalidate(), utils.cart.getCartItems.invalidate()])
		},
	})

	const debouncedUpdate = useCallback(() => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current)
		}
		debounceTimeout.current = setTimeout(() => {
			updateMutation.mutate({ productId: product.id, quantity: localQuantity, gid })
		}, 500)
	}, [product.id, gid, updateMutation])

	useEffect(() => {
		if (localQuantity !== quantity) {
			debouncedUpdate()
		}
	}, [localQuantity, quantity, debouncedUpdate])

	const handleQuantityChange = (newQuantity: number) => {
		setLocalQuantity(newQuantity)
	}

	const handleRemove = () => {
		removeMutation.mutate({ productId: product.id, gid })
	}

	const displayPrice =
		product.discount > 0 ? Math.round(product.price * (1 - product.discount)) : Math.round(product.price)

	return (
		<>
			<div
				className={`border border-border p-2 mb-2 mr-2 bg-surface flex ${
					showControls && `sm:flex-row flex-col`
				} items-center justify-between gap-4`}>
				<div
					onClick={() => showControls && handleOpen()}
					className={`w-full cursor-pointer ${
						!showControls && 'flex flex-col sm:flex-row items-center justify-start cursor-default gap-x-4'
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
								selectedQuantity={localQuantity}
								setSelectedQuantity={handleQuantityChange}
								availability={product.available + quantity}
								strictLimit={true}
							/>
							<p>Price: {displayPrice}</p>
						</div>
						<IconButton size='large' color='error' onClick={handleRemove}>
							<BiTrash />
						</IconButton>
					</div>
				) : (
					<div className='w-full flex gap-4 text-xl justify-center items-center text-center'>
						<p>{localQuantity}</p>
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

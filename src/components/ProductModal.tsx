import { IconButton, Rating, styled } from '@mui/material'
import { ImHeart as FavoriteIcon } from 'react-icons/im'
import StarIcon from '@mui/icons-material/Star'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import ReviewList from './ReviewList'
import ModalPriceSection from './ModalPriceSection'
import { trpc } from '~/server/client'
import useStore from '~/store/useStore'
import TransitionsModal from './TransitionModal'

const StyledRating = styled(Rating)({
	'& .MuiRating-iconFilled': {
		color: '#f1f5f9',
		filter: 'drop-shadow(1px 0.75px 0px rgb(0 0 0 / 1))',
	},
	'& .MuiRating-iconEmpty': {
		color: '#1e293b',
		fill: 'black',
	},
})

const ProductModal = () => {
	const { product } = useStore(state => ({
		product: state.product,
	}))

	const [isFavorite, setIsFavorite] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)

	const addFavoriteMutation = trpc.favorite.addFavorite.useMutation()
	const removeFavoriteMutation = trpc.favorite.removeFavorite.useMutation()
	const { data: favorites } = trpc.favorite.getFavorites.useQuery()

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
	}, [])

	const handleModalOpen = useCallback(() => {
		if (window.innerWidth < 768) setModalOpen(true)
	}, [])

	const handleToggleFavorite = useCallback(() => {
		if (!product) return
		if (isFavorite) {
			removeFavoriteMutation.mutate({ productId: product.id })
			setIsFavorite(false)
		} else {
			addFavoriteMutation.mutate({ productId: product.id })
			setIsFavorite(true)
		}
	}, [isFavorite, product, addFavoriteMutation, removeFavoriteMutation])

	useEffect(() => {
		if (favorites && product) {
			const favExists = favorites.some(fav => fav.product.id === product.id)
			setIsFavorite(favExists)
		}
	}, [favorites, product])

	if (!product) return null

	return (
		<>
			<div className='h-[80dvh] w-[80dvw] flex md:gap-8 gap-2'>
				<div className='hidden md:block md:w-1/2'>
					<ReviewList />
				</div>
				<div className='md:w-1/2 w-full flex justify-around md:gap-8 gap-2'>
					<div className='absolute'>
						<h2 className='relative w-full font-semibold text-2xl'>
							{product.name}
							<IconButton
								className='absolute -top-2 group'
								disableFocusRipple
								disableRipple
								disableTouchRipple
								onClick={handleToggleFavorite}>
								{isFavorite ? (
									<FavoriteIcon
										className='stroke-green-950 stroke-1 overflow-visible text-green-600 transition-colors'
										fontSize={26}
									/>
								) : (
									<FavoriteIcon
										className='stroke-green-950 stroke-1 overflow-visible text-transparent group-hover:text-green-200 transition-colors'
										fontSize={26}
									/>
								)}
							</IconButton>
						</h2>
					</div>
					<div className='w-1/2 sm:scale-100 scale-90 flex flex-col items-center justify-evenly'>
						<div
							onClick={handleModalOpen}
							className='p-4 flex flex-col shadow-inset-1 rounded-2xl text-black bg-green-700 md:hover:bg-green-700 hover:bg-green-500 md:cursor-default cursor-pointer transition-colors'>
							<p className='font-semibold text-xl'>{product.rating.toFixed(2)}</p>
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className='text-2xl'
								value={product.rating}
								max={5}
								precision={0.25}
								name='read-only'
								readOnly
							/>
						</div>
						<div>
							<div className='my-4 p-4 shadow-inset-2 rounded-xl bg-gradient-to-bl from-zinc-900 via-green-300 to-zinc-900'>
								<div className='relative min-h-36 h-full min-w-32'>
									<Image
										className='hover:scale-110 object-contain transition-transform'
										src={product.imgURL}
										fill
										alt='Product Image'
									/>
								</div>
							</div>
							<div className='p-2 rounded-md shadow-inset-3 bg-gradient-to-b from-green-400 via-green-200 to-green-500 md:text-sm text-xs text-green-950 font-semibold'>
								{product.description}
							</div>
						</div>
					</div>
					<ModalPriceSection />
				</div>
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<ReviewList />
			</TransitionsModal>
		</>
	)
}

export default ProductModal

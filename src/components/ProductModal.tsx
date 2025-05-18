import { IconButton, Rating, styled, Typography, Box } from '@mui/material'
import { ImHeart as FavoriteIcon } from 'react-icons/im'
import StarIcon from '@mui/icons-material/Star'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import ReviewList from './ReviewList'
import ModalPriceSection from './ModalPriceSection'
import { trpc } from '~/server/client'
import useStore from '~/store/useStore'
import TransitionsModal from './TransitionModal'
import { useSession } from 'next-auth/react'

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
	const { product } = useStore(state => ({ product: state.product }))
	const [isFavorite, setIsFavorite] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const { data: session } = useSession()

	const { data: favorites } = trpc.favorite.getFavorites.useQuery(undefined, { enabled: !!session })
	const addFavorite = trpc.favorite.addFavorite.useMutation({
		onSuccess: () => {
			setIsFavorite(true)
		},
	})
	const removeFavorite = trpc.favorite.removeFavorite.useMutation({
		onSuccess: () => {
			setIsFavorite(false)
		},
	})

	const handleModalOpen = useCallback(() => {
		if (window.innerWidth < 768) setModalOpen(true)
	}, [])

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
	}, [])

	const handleToggleFavorite = useCallback(() => {
		if (!product) return
		if (isFavorite) {
			removeFavorite.mutate({ productId: product.id })
		} else {
			addFavorite.mutate({ productId: product.id })
		}
	}, [isFavorite, product, addFavorite, removeFavorite])

	useEffect(() => {
		if (favorites && product) {
			setIsFavorite(favorites.some(fav => fav.product.id === product.id))
		}
	}, [favorites, product])

	const { data: comments = [] } = trpc.product.getComments.useQuery(
		{ productId: product?.id ?? '' },
		{ enabled: !!product }
	)

	const avgRating = comments.length > 0 ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length : 0

	if (!product) return null

	return (
		<>
			<div className='h-[80dvh] w-[80dvw] flex md:gap-8 gap-2'>
				<div className='hidden md:block md:w-1/2'>
					<ReviewList productId={product.id} />
				</div>
				<div className='md:w-1/2 w-full flex justify-around md:gap-8 gap-2'>
					<div className='absolute'>
						<h2 className='relative w-full font-semibold text-2xl'>
							{product.name}
							<IconButton className='absolute -top-2 group' disableRipple onClick={handleToggleFavorite}>
								<FavoriteIcon
									className={
										isFavorite
											? 'stroke-green-950 stroke-1 text-green-600'
											: 'stroke-green-950 stroke-1 text-transparent group-hover:text-green-200'
									}
									fontSize={26}
								/>
							</IconButton>
						</h2>
					</div>
					<div className='w-1/2 sm:scale-100 scale-90 flex flex-col items-center justify-evenly'>
						<div
							onClick={handleModalOpen}
							className='p-4 flex flex-col shadow-inset-1 rounded-2xl text-black bg-green-700 hover:bg-green-500 cursor-pointer transition-colors'>
							<Typography className='font-semibold text-xl'>{avgRating.toFixed(2)}</Typography>
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className='text-2xl'
								value={avgRating}
								max={5}
								precision={0.25}
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
				<ReviewList productId={product.id} />
			</TransitionsModal>
		</>
	)
}

export default ProductModal

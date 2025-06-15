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

const StyledRating = styled(Rating)(({ theme }) => ({
	'& .MuiRating-iconFilled': {
		color: theme.palette.primary.main,
		filter: 'drop-shadow(1px 0.75px 0px rgb(0 0 0 / 1))',
	},
	'& .MuiRating-iconEmpty': {
		color: theme.palette.text.secondary,
		fill: theme.palette.background.paper,
	},
}))

const ProductModal = () => {
	const { product } = useStore(state => ({ product: state.product }))
	const [isFavorite, setIsFavorite] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const { data: session } = useSession()

	const { data: favorites } = trpc.favorite.getFavorites.useQuery(undefined, { enabled: !!session })
	const addFavorite = trpc.favorite.addFavorite.useMutation({ onSuccess: () => setIsFavorite(true) })
	const removeFavorite = trpc.favorite.removeFavorite.useMutation({ onSuccess: () => setIsFavorite(false) })

	const handleModalOpen = useCallback(() => {
		if (window.innerWidth < 768) setModalOpen(true)
	}, [])

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
	}, [])

	const handleToggleFavorite = useCallback(() => {
		if (!product) return
		isFavorite ? removeFavorite.mutate({ productId: product.id }) : addFavorite.mutate({ productId: product.id })
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
	const avgRating = comments.length ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length : 0

	if (!product) return null

	const { categoryName, subCategoryName } = product

	return (
		<>
			<div className='h-[80dvh] w-[80dvw] flex md:gap-8 gap-2'>
				<div className='hidden md:block md:w-1/2'>
					<ReviewList productId={product.id} />
				</div>
				<div className='md:w-1/2 w-full flex justify-around md:gap-8 gap-2'>
					<Box className='absolute '>
						<Typography variant='h5' className='font-semibold text-2xl text-center flex justify-center items-center'>
							{product.name}
							<IconButton className='ml-2' disableRipple onClick={handleToggleFavorite}>
								<FavoriteIcon
									className={
										isFavorite
											? 'stroke-border stroke-1 text-focus'
											: 'stroke-border stroke-1 text-transparent group-hover:text-tertiary'
									}
									fontSize={26}
								/>
							</IconButton>
						</Typography>
						<Box className='mt-1'>
							<Typography variant='subtitle2' className='text-sm text-secondary'>
								Category: {categoryName}
							</Typography>
							{subCategoryName && (
								<Typography variant='subtitle2' className='text-sm text-secondary'>
									Subcategory: {subCategoryName}
								</Typography>
							)}
						</Box>
					</Box>
					<div className='mt-24 w-1/2 sm:scale-100 scale-90 '>
						<div className='flex items-center justify-center'>
							<div
								onClick={handleModalOpen}
								className={`p-4 w-fit flex flex-col shadow-inset-1 border-border border rounded-2xl text-text bg-surface hover:bg-bg ${
									window.innerWidth < 768 && 'cursor-pointer'
								} transition-colors`}>
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
						</div>
						<div className='flex flex-col items-center justify-center'>
							<div className='w-fit my-4 p-4 shadow-inset-2 rounded-xl bg-gradient-to-bl from-bg via-secondary to-bg'>
								<div className='relative min-h-36 h-full min-w-32'>
									<Image
										className='hover:scale-110 object-contain transition-transform'
										src={product.imgURL}
										fill
										alt='Product Image'
									/>
								</div>
							</div>
							<p className='p-2 rounded-md shadow-inset-3 bg-gradient-to-b from-primary via-tertiary to-primary md:text-sm text-xs text-bg font-semibold'>
								{product.description}
							</p>
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

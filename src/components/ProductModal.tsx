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
		if (window.innerWidth < 1024) setModalOpen(true)
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
			setIsFavorite(favorites.some((fav: (typeof favorites)[number]) => fav.product.id === product.id))
		}
	}, [favorites, product])

	const { data: comments = [] } = trpc.product.getComments.useQuery(
		{ productId: product?.id ?? '' },
		{ enabled: !!product },
	)
	const avgRating = comments.length
		? comments.reduce((sum: number, c: (typeof comments)[number]) => sum + c.rating, 0) / comments.length
		: 0

	if (!product) return null

	const { categoryName, subCategoryName } = product

	return (
		<>
			<div className='w-[95dvw] p-2 sm:p-4 xl:p-0 xl:pt-8 xl:pb-4 max-w-[1500px] flex flex-col lg:flex-row justify-evenly gap-3 md:gap-5 lg:gap-8'>
				<div className=' hidden lg:block lg:w-1/3'>
					<ReviewList productId={product.id} />
				</div>
				<div className='lg:w-1/2 w-full flex flex-col gap-3 md:gap-4 lg:gap-6'>
					<div className='flex flex-col lg:flex-row justify-end gap-y-4 lg:gap-y-0 gap-x-16 lg:gap-x-8 xl:gap-x-32 self-center lg:self-start '>
						<Box className='w-full '>
							<Typography
								variant='h5'
								className='font-semibold text-xl md:text-2xl text-center lg:text-left flex justify-center md:justify-start items-center'>
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
							<Box className='mt-1 text-center lg:text-left'>
								<Typography variant='subtitle2' className='text-sm text-secondary break-words'>
									Category: {categoryName}
								</Typography>
								{subCategoryName && subCategoryName !== 'undefined' && (
									<Typography variant='subtitle2' className='text-sm text-secondary break-words'>
										Subcategory: {subCategoryName}
									</Typography>
								)}
							</Box>
						</Box>
						<div
							onClick={handleModalOpen}
							className={`2xl:mt-0 py-4 px-8 lg:p-2 w-fit flex flex-col self-center shadow-inset-1 border-border border rounded-2xl text-text bg-surface hover:brightness-150 transition-all`}>
							<Typography className='font-semibold text-xl'>{avgRating.toFixed(2)}</Typography>
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className='text-xl md:text-lg lg:text-2xl'
								value={avgRating}
								max={5}
								precision={0.25}
								readOnly
							/>
						</div>
					</div>
					<div className='w-full flex flex-col md:flex-row lg:flex-row md:items-start justify-center items-center md:gap-4 lg:gap-8'>
						<div className='w-full md:w-[56%] lg:w-1/2 sm:scale-100 scale-95 md:scale-100 cursor-pointer lg:cursor-auto'>
							<div className='flex items-center  justify-center'></div>
							<div className='flex flex-col items-center justify-center'>
								<div className='w-fit my-5 md:my-4  p-3 shadow-inset-2 rounded-xl bg-gradient-to-bl from-bg via-secondary to-bg'>
									<div className='relative min-h-52 md:min-h-48 lg:min-h-56 h-full min-w-48 md:min-w-44 lg:min-w-52'>
										<Image
											className='hover:scale-105 brightness-90 [filter:drop-shadow(1px_0_0_rgba(0,0,0,0.8))_drop-shadow(-1px_0_0_rgba(0,0,0,0.8))_drop-shadow(0_1px_0_rgba(0,0,0,0.8))_drop-shadow(0_-1px_0_rgba(0,0,0,0.8))_drop-shadow(0_0_6px_rgba(255,255,255,0.10))_drop-shadow(0_2px_3px_rgba(0,0,0,0.65))] object-contain transition-transform'
											src={product.imgURL}
											fill
											sizes='(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 200px'
											alt='Product Image'
										/>
									</div>
								</div>
								<p
									className='p-2 rounded-md mb-2 md:mb-3 lg:mb-4 shadow-inset-3 bg-gradient-to-b from-primary via-tertiary to-primary text-sm lg:text-base text-bg font-semibold tracking-tight text-left w-full sm:w-2/3 md:w-full'
									style={{ wordSpacing: '-3px', lineHeight: 1.2 }}>
									{product.description}
								</p>
							</div>
						</div>

						<ModalPriceSection />
					</div>
				</div>
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<ReviewList productId={product.id} />
			</TransitionsModal>
		</>
	)
}

export default ProductModal

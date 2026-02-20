import StarIcon from '@mui/icons-material/Star'
import { Rating, styled } from '@mui/material'
import Image from 'next/image'
import { GiBottleCap as Caps } from 'react-icons/gi'
import { FaPercent as Percent } from 'react-icons/fa'
import { useCallback, useState } from 'react'
import TransitionsModal from './TransitionModal'
import ProductModal from './ProductModal'
import { trpc } from '~/server/client'
import useStore from '~/store/useStore'
import { getBackgroundTextureById } from '~/utils/cardBackgroundTextures'
import { getBackgroundDetailsById } from '~/utils/cardBackgroundDetails'

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

export interface ProductCardProps {
	id: string
	name: string
	price: number
	rating: number
	available: number
	popularity: number
	discount: number
	categoryId?: number
	subCategoryId?: number | null
	categoryName?: string
	subCategoryName?: string | null
	imgURL: string
	description: string
}

const ProductCard = ({ id, name, price, rating, discount, available, imgURL }: ProductCardProps) => {
	const [modalOpen, setModalOpen] = useState(false)
	const cardBgTextures = getBackgroundTextureById(id)
	const cardBgDetails = getBackgroundDetailsById(id)
	const setProduct = useStore(state => state.setProduct)
	const utils = trpc.useUtils()

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
		utils.favorite.getFavorites.invalidate()
	}, [utils])

	const handleOpen = useCallback(async () => {
		const updatedProduct = await utils.product.getById.fetch({ id })
		setProduct(updatedProduct)
		setModalOpen(true)
	}, [id, setProduct, utils.product.getById])

	return (
		// container
		<>
			<div
				onClick={handleOpen}
				tabIndex={0}
				className={`${
					available ? 'grayscale-0 opacity-100' : 'grayscale opacity-90'
				} relative max-h-60 min-h-44 h-full max-w-48 min-w-52 p-4 transition hover:scale-105 cursor-pointer z-0`}>
				{/* badge */}
				{discount > 0 && (
					<>
						{/* badge-back */}
						<div
							className='absolute top-1 left-1 h-11 w-11 p-1 bg-orange-200
				 shadow-inset-2 rounded-lg -z-[1] '></div>
						{/* bagde-front */}
						<div className='w-[36px] top-2 left-2 absolute flex items-center justify-center border-[3px] border-primary rounded-md bg-amber-200 font-semibold text-xl text-red-600 z-10'>
							<div className='absolute inset-0 z-10 overflow-hidden opacity-20 sepia saturation-200 pointer-events-none'>
								<Image
									src={cardBgTextures}
									alt='card background texture'
									className='sepia saturation-200'
									style={{ transform: 'scale(2)' }}
									objectFit='contain'
									fill
								/>
							</div>

							<p className='relative -top-[4px] ml-[3px] mr-[8px] my-[1px] tracking-tighter text-md '>
								{(discount * 100).toFixed(0)}
							</p>
							<Percent fontSize={'8px'} className='absolute bottom-[13px] right-0' />
							<p className='absolute -bottom-[2px] text-xs'>OFF</p>
						</div>
					</>
				)}
				{/* box */}
				<div className='relative p-[6px] h-full shadow-inset-2 rounded-xl bg-orange-200 z-0 overflow-hidden '>
					<div className='absolute inset-0 z-10 overflow-hidden opacity-25 sepia mix-blend-overlay saturation-200 pointer-events-none'>
						<Image
							src={cardBgTextures}
							alt='card background texture'
							className='sepia mix-blend-overlay saturation-200'
							style={{ transform: 'scale(2)' }}
							objectFit='contain'
							fill
						/>
					</div>
					<div className='absolute inset-0 z-10 overflow-hidden opacity-50 sepia mix-blend-overlay saturation-200 pointer-events-none'>
						<Image
							src={cardBgDetails}
							alt='card background details'
							className='sepia mix-blend-overlay saturation-200'
							style={{ transform: 'scale(2)' }}
							objectFit='contain'
							fill
						/>
					</div>
					{/* border-covers  */}
					{discount > 0 && (
						<>
							<div
								className='absolute -top-[3px] -left-[10px] h-2 w-10 p-1 bg-orange-200
				rounded-lg z-50'></div>
							<div
								className='absolute -top-[10px] -left-[3px] h-10 w-2 p-1 bg-orange-200
				rounded-lg z-50'></div>
						</>
					)}
					{/* content */}
					<div className='h-full flex flex-col justify-between rounded-lg bg-gradient-to-bl from-bg via-secondary to-bg '>
						<h4
							className={`${
								discount > 0 && 'pl-6 rounded-tr-lg'
							} w-full h-[36px] pl-0 flex items-center justify-center text-sm tracking-tighter rounded-t-lg bg-surface text-text font-semibold `}
							style={{ wordSpacing: '-3px', lineHeight: 1.2 }}>
							{name}
						</h4>
						<div className='h-full w-full p-1'>
							<div className='relative h-full w-full '>
								<Image
									className=' object-contain'
									src={imgURL}
									fill
									sizes='(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 200px'
									alt='Product Image'
								/>
							</div>
						</div>

						{/* content-box-info */}

						<div className='p-2 relative flex flex-col items-start justify-center rounded-md shadow-inset-3 bg-gradient-to-b from-primary via-tertiary to-primary text-white font-semibold z-0'>
							{/* ribbon-tip */}
							<div className='absolute h-[22px] w-[4px] -right-[2px] bottom-[7px] shadow-inset-1 rounded-md bg-primary'></div>
							{/* ribbon-border */}
							<div className='h-[18px] w-[86px] absolute right-0 bottom-[7px] pl-1 chevron bg-bg -z-[1]'></div>
							{/* ribbon with ratings */}
							<div className='h-4 w-[84px] absolute right-0 bottom-2 pl-1 chevron flex items-center bg-primary z-0'>
								<StyledRating
									emptyIcon={<StarIcon fontSize='inherit' />}
									className='text-base'
									name='read-only'
									value={rating}
									max={5}
									precision={0.25}
									readOnly
								/>
							</div>
							{/* price-box */}
							<div className='flex flex-col items-start pl-2 text-bg'>
								<div className='flex items-center gap-1'>
									{discount > 0 ? (price * (1 - discount)).toFixed(0) : price}
									<Caps />
								</div>
								{discount > 0 && (
									<div className='flex items-center gap-1 text-xs line-through decoration-red-500 decoration-2'>
										{price} <Caps />
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<ProductModal />
			</TransitionsModal>
		</>
	)
}

export default ProductCard

import { ImHeart as Favorite } from 'react-icons/im'
import StarIcon from '@mui/icons-material/Star'
import Image from 'next/image'
import { useState } from 'react'
import { IconButton, Rating, styled } from '@mui/material'
import ModalPriceSection from './ModalPriceSection'
import Reviews from './Reviews'

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
	const [isFavorite, setIsFavorite] = useState(false)
	const [ratingValue, setRatingValue] = useState(4.5)

	const handleIsFavorite = () => {
		setIsFavorite(prev => !prev)
	}

	return (
		<div className='h-[500px] flex md:gap-8 gap-2'>
			<Reviews />

			<div className='md:w-1/3 w-1/2 flex flex-col items-center justify-evenly'>
				<h2 className='relative w-full font-semibold text-xl'>
					Stimpak{' '}
					<IconButton
						className='absolute right-0 -top-2 group'
						disableFocusRipple
						disableRipple
						disableTouchRipple
						onClick={handleIsFavorite}>
						{isFavorite ? (
							<Favorite
								className='stroke-green-950 stroke-1 overflow-visible text-green-600 transition-colors'
								fontSize={26}
							/>
						) : (
							<Favorite
								className='stroke-green-950 stroke-1 overflow-visible text-transparent group-hover:text-green-200 transition-colors'
								fontSize={26}
							/>
						)}
					</IconButton>
				</h2>
				<div>
					<p className='font-semibold text-lg'>{ratingValue}</p>
					<StyledRating
						emptyIcon={<StarIcon fontSize='inherit' />}
						className='bg-green-700 text-2xl'
						value={ratingValue}
						max={5}
						precision={0.25}
						name='read-only'
						readOnly
					/>
				</div>
				<div>
					<div className='my-4 p-4 shadow-inset-2 rounded-xl bg-gradient-to-bl from-zinc-900 via-green-300 to-zinc-900'>
						<div className='relative min-h-36 h-full min-w-32'>
							<Image className=' object-contain' src={'/imgs/stimpak.webp'} fill alt='Product Image' />
						</div>
					</div>
					<div className='p-2 rounded-md shadow-inset-3 bg-gradient-to-b from-green-400 via-green-200 to-green-500 md:text-sm text-xs text-green-950 font-semibold'>
						Stimpak provides rapid healing, instantly restoring your health. Essential for surviving the
						Wasteland&apos;s dangers.
					</div>
				</div>
			</div>

			<ModalPriceSection />
		</div>
	)
}

export default ProductModal

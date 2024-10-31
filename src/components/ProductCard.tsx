import StarIcon from '@mui/icons-material/Star'
import { Rating, styled } from '@mui/material'
import Image from 'next/image'
import { GiBottleCap as Caps } from 'react-icons/gi'
import { FaPercent as Percent } from 'react-icons/fa'
import { useCallback, useState } from 'react'
import TransitionsModal from './TransitionModal'
import ProductModal from './ProductModal'

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
	rating?: number
	available: number
	popularity?: number
	discount: number
	categoryId?: number
	subCategoryId?: number | null
	categoryName?: string
	subCategoryName?: string
	imgURL: string
	description: string
}

const ProductCard = ({ name, price, rating, discount, available, imgURL }: ProductCardProps) => {
	const [modalOpen, setModalOpen] = useState(false)

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
	}, [])

	const handleOpen = () => setModalOpen(true)

	return (
		// container
		<>
			<div
				onClick={handleOpen}
				tabIndex={0}
				className={`focus:scale-110 focus:outline-0 ${
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
						<div className='top-2 left-2 absolute flex items-center justify-center border-[3px] border-[#0b5c29] rounded-md bg-amber-200 font-semibold text-xl text-red-600 z-10'>
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
					<div className='h-full flex flex-col justify-between rounded-lg bg-gradient-to-bl from-zinc-900 via-green-300 to-zinc-900 '>
						<h4
							className={`${
								discount > 0 && 'w-11/12 pl-3 rounded-tr-lg'
							} w-full h-[36px] pl-0 flex items-center justify-center text-sm tracking-tighter rounded-t-lg bg-green-700 text-orange-200 font-semibold `}>
							{name}
						</h4>
						<div className='h-full w-full p-1'>
							<div className='relative h-full w-full '>
								<Image className=' object-contain' src={imgURL} fill alt='Product Image' />
							</div>
						</div>

						{/* content-box-info */}
						<div className='p-2 relative flex flex-col items-start justify-center rounded-md shadow-inset-3 bg-gradient-to-b from-green-400 via-green-200 to-green-500 text-white font-semibold z-0'>
							{/* ribbon-tip */}
							<div className='absolute h-[22px] w-[4px] -right-[2px] bottom-[7px] shadow-inset-1 rounded-md bg-green-500'></div>
							{/* ribbon-border */}
							<div className='h-[18px] w-[86px] absolute right-0 bottom-[7px] pl-1 chevron bg-[#303030] -z-[1]'></div>
							{/* ribbon with ratings */}
							<div className='h-4 w-[84px] absolute right-0 bottom-2 pl-1 chevron flex items-center bg-green-500 z-0'>
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
							<div className='flex flex-col items-start pl-2 text-green-950'>
								<div className='flex items-center gap-1'>
									{discount > 0 ? price * discount : price}
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

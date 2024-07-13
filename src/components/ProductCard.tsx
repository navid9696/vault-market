import StarIcon from '@mui/icons-material/Star'
import { FiMinus as Minus } from 'react-icons/fi'
import { Rating, styled } from '@mui/material'
import Image from 'next/image'
import { GiBottleCap as Caps } from 'react-icons/gi'
import { LiaPercentSolid as Percent } from 'react-icons/lia'
import { useState } from 'react'

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

const ProductCard = () => {
	const [isOnSale, setisOnSale] = useState(true)
	return (
		<div className='relative  max-h-64 min-h-52 h-full max-w-52 min-w-48 p-4 transition hover:scale-110 z-0'>
			{isOnSale && (
				<>
					<div
						className='absolute top-2 left-2 h-10 w-10 p-1 bg-orange-200
				 shadow-inset-2 rounded-lg -z-[1] '></div>
					<div className='p-[1px] top-3 left-3 absolute flex items-center justify-center border-[3px] border-[#0b5c29] rounded-md bg-amber-200 font-semibold text-xl text-red-600 z-10'>
						<Percent fontSize={'24px'} className='relative -right-1' />
						<span className='absolute left-0'>
							<Minus fontSize={'12px'} className='mt-[4px]' />
						</span>
					</div>
				</>
			)}

			<div className='relative p-[6px] h-full shadow-inset-2 rounded-xl cursor-pointer bg-orange-200 z-0 overflow-hidden '>
				{isOnSale && (
					<>
						<div
							className='absolute -top-[3px] -left-[10px] h-2 w-10 p-1 bg-orange-200
				rounded-lg z-50'></div>
						<div
							className='absolute -top-[10px] -left-[3px] h-10 w-2 p-1 bg-orange-200
				rounded-lg z-50'></div>
					</>
				)}

				<div className='h-full flex flex-col justify-between rounded-lg bg-gradient-to-bl from-zinc-900 via-green-400 to-zinc-900 '>
					<h4
						className={`${
							isOnSale && 'w-11/12 pl-3 rounded-tr-lg'
						} w-full h-[22px] pl-0 flex items-center justify-center text-md rounded-t-lg bg-green-700 text-orange-200 font-semibold `}>
						Stimpak
					</h4>
					<div className='p-2 flex flex-grow flex-col items-center'>
						<div className='relative h-full w-full '>
							<Image className=' object-contain' src={'/imgs/stimpak.webp'} fill alt='Product Image' />
						</div>
					</div>

					<div className='p-2 relative flex flex-col items-start justify-center rounded-md shadow-inset-3 bg-gradient-to-b from-green-400 via-green-200 to-green-500 text-white font-semibold z-0'>
						<div className='absolute h-[22px] w-[4px] -right-[2px] bottom-[7px] shadow-inset-1 rounded-md bg-green-500'></div>
						<div className='h-[18px] w-[86px] absolute right-0 bottom-[7px] pl-1 chevron bg-[#303030] -z-[1]'></div>

						<div className='flex flex-col items-start pl-2 text-green-950'>
							<div className='flex items-center gap-1'>
								1500
								<Caps />
							</div>
							{isOnSale && (
								<div className='flex items-center gap-1 text-xs line-through decoration-red-500 decoration-2'>
									2100 <Caps />
								</div>
							)}
						</div>

						<div className='h-4 w-[84px] absolute right-0 bottom-2 pl-1 chevron flex items-center bg-green-500 z-0'>
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className='text-base'
								name='read-only'
								value={3}
								max={5}
								precision={0.25}
								readOnly
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductCard

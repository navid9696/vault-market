import FavoriteTwoTone from '@mui/icons-material/FavoriteTwoTone'
import Favorite from '@mui/icons-material/Favorite'
import { FiMinus as Minus } from 'react-icons/fi'
import { Rating, styled } from '@mui/material'
import Image from 'next/image'
import { GiBottleCap as Caps } from 'react-icons/gi'
import { LiaPercentSolid as Percent } from 'react-icons/lia'
import { useState } from 'react'

const StyledRating = styled(Rating)({
	'& .MuiRating-iconFilled': {
		color: '#15803d',
	},
	'& .MuiRating-iconEmpty': {
		color: '#15803d',
	},
})

const ProductCard = () => {
	const [isOnSale, setisOnSale] = useState(true)
	return (
		<div className='relative max-h-64 min-h-52 h-full max-w-48 min-w-36 p-4 transition hover:scale-105 z-0'>
			{isOnSale && (
			<div
				className='absolute top-2 left-2 h-10 w-10 p-1 bg-orange-200
				border-2 border-black rounded-lg -z-[1] '></div>

			)}

			<div className='p-[1px] top-3 left-3 absolute flex items-center justify-center border-[3px] border-[#0b5c29] rounded-md bg-orange-200 font-semibold text-xl text-red-600 z-10'>
				<Percent fontSize={'24px'} className='relative -right-1' />
				<span className='absolute left-0'>
					<Minus fontSize={'12px'} className='mt-[3px]' />
				</span>
			</div>

			<div className='relative p-[6px] h-full box rounded-xl cursor-pointer bg-orange-200 z-0 overflow-hidden'>
				<div
					className='absolute -top-[3px] -left-[10px] h-2 w-10 p-1 bg-orange-200
				rounded-lg z-50'></div>
				<div
					className='absolute -top-[10px] -left-[3px] h-10 w-2 p-1 bg-orange-200
				rounded-lg z-50'></div>

				<div className='h-full flex flex-col justify-between rounded-lg bg-gradient-to-bl from-zinc-900 via-green-400 to-zinc-900 border-black'>
					<h4
						className={`${
							isOnSale && 'w-11/12 pl-3 rounded-tr-lg'
						} w-full pl-0 text-sm rounded-t-lg bg-green-700 text-orange-200 font-semibold text-center `}>
						Stimpak
					</h4>
					<div className='p-2 flex flex-grow flex-col items-center'>
						<div className='relative h-full w-full '>
							<Image className=' object-contain' src={'/imgs/stimpak.webp'} fill alt='Product Image' />
						</div>
					</div>

					<div className='p-2 flex flex-col items-center justify-center border-[3px] rounded-md border-zinc-800 bg-gradient-to-b from-green-400 via-green-200 to-green-500 text-white'>
						<div className='flex items-center gap-1 text-green-950'>
							1500
							<Caps />
						</div>
						<StyledRating
							icon={<Favorite fontSize='inherit' />}
							emptyIcon={<FavoriteTwoTone fontSize='inherit' />}
							className='text-base'
							name='read-only'
							value={3}
							max={5}
							readOnly
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductCard

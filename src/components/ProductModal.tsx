import { ImHeart as Favorite } from 'react-icons/im'
import { GiBottleCap as Caps } from 'react-icons/gi'
import { BiCommentAdd as AddReview } from 'react-icons/bi'
import StarIcon from '@mui/icons-material/Star'
import Image from 'next/image'
import { useState } from 'react'
import { Button, IconButton, Rating, styled } from '@mui/material'
import QuantitySelector from './QuantitySelector'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone'
import ShoppingCartCheckoutTwoToneIcon from '@mui/icons-material/ShoppingCartCheckoutTwoTone'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

function renderRow(props: ListChildComponentProps) {
	const { index, style } = props

	return (
		<ListItem className='p-2 bg-red-200' style={style} key={index} component='div'>
			<ListItemButton>
				<ListItemText primary={`Item ${index + 1}`} />
			</ListItemButton>
		</ListItem>
	)
}

interface ProductModalProps {
	isOnSale: boolean
}

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

const ProductModal = ({ isOnSale }: ProductModalProps) => {
	const [isFavorite, setIsFavorite] = useState(false)

	const handleIsFavorite = () => {
		setIsFavorite(prev => !prev)
	}

	return (
		<div className='flex gap-8'>
			<div className='flex flex-col gap-4'>
				<StyledRating
					emptyIcon={<StarIcon fontSize='inherit' />}
					className='bg-green-700 text-2xl'
					value={3}
					max={5}
					precision={0.25}
					name='read-only'
					readOnly
				/>
				<div className='flex items-center justify-between gap-4'>
					<h3 className='w-full text-left font-semibold text-sm'>REVIEWS</h3>
					<Button size='small' className='min-w-36 text-base' endIcon={<AddReview />}>
						Add Review
					</Button>
				</div>
				<Box sx={{ width: '100%', height: 400, maxWidth: 260, bgcolor: 'background.paper' }}>
					<FixedSizeList height={400} width={260} itemSize={46} itemCount={200} overscanCount={5}>
						{renderRow}
					</FixedSizeList>
				</Box>
			</div>

			<div className='relative flex flex-col items-center justify-between'>
				<div className='flex items-center'>
					<h2 className='font-semibold text-xl'>Stimpak</h2>
					<IconButton
						className='absolute right-5 group'
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
				</div>

				<div className='my-4 p-4 shadow-inset-2 rounded-xl bg-gradient-to-bl from-zinc-900 via-green-300 to-zinc-900'>
					<div className='relative max-h-64 min-h-44 h-full max-w-52 min-w-44'>
						<Image className=' object-contain' src={'/imgs/stimpak.webp'} fill alt='Product Image' />
					</div>
				</div>
				<div className='max-w-96 p-2 rounded-md shadow-inset-3 bg-gradient-to-b from-green-400 via-green-200 to-green-500 text-xs text-green-950 font-semibold '>
					Stimpak provides rapid healing, instantly restoring your health. Essential for surviving the Wasteland&apos;s
					dangers.
				</div>
			</div>

			<div className='flex flex-col justify-evenly '>
				<div className='flex flex-col items-center text-green-950'>
					<h3 className='w-full text-left font-semibold text-sm'>PRICE</h3>
					<div className='w-full flex justify-between gap-4'>
						<p className='flex items-center gap-1 text-3xl'>
							1500
							<Caps />
						</p>
						{isOnSale && (
							<p className='flex items-center gap-1 line-through decoration-red-500 decoration-2'>
								2100
								<Caps />
							</p>
						)}
					</div>
				</div>
				<div>
					<QuantitySelector />
					<p className='text-xs'>in stock {123}</p>
				</div>
				<div className='flex flex-col gap-4'>
					<Button className='text-base' endIcon={<AddShoppingCartTwoToneIcon />}>
						add to cart
					</Button>
					<Button className='text-base' endIcon={<ShoppingCartCheckoutTwoToneIcon />}>
						buy now
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ProductModal

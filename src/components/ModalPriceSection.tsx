import { Button } from '@mui/material'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone'
import ShoppingCartCheckoutTwoToneIcon from '@mui/icons-material/ShoppingCartCheckoutTwoTone'
import { GiBottleCap as Caps } from 'react-icons/gi'
import QuantitySelector from './QuantitySelector'
import Link from 'next/link'

// will be improved in future
const PriceSection = () => {
	return (
		<div className='w-1/2 flex flex-col justify-evenly items-center '>
			<div className='sm:w-full flex flex-col items-center text-green-950'>
				<h3 className='w-full text-left font-semibold text-sm'>PRICE</h3>
				<div className='w-full flex flex-col sm:flex-row justify-start gap-4'>
					<p className='flex items-center gap-1 md:text-2xl text-xl'>
						1500
						<Caps />
					</p>

					<p className='flex items-center gap-1 line-through md:text-base text-sm decoration-red-500 decoration-2'>
						2100
						<Caps />
					</p>
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
				<Link href={'/cart'}>
					<Button className='text-base' endIcon={<ShoppingCartCheckoutTwoToneIcon />}>
						buy now
					</Button>
				</Link>
			</div>
		</div>
	)
}

export default PriceSection

import { Slider } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { exampleProducts } from './ProductsBrowsing'
import { ProductCardProps } from './ProductCard'

interface FiltersProps {
	setProducts: Dispatch<SetStateAction<ProductCardProps[]>>
}
function valuetext(value: number) {
	return `${value}`
}

const Filters = ({ setProducts }: FiltersProps) => {
	const [price, setPrice] = React.useState<number[]>([50, 5000])

	const handlePriceChange = (e: Event, newValue: number | number[]) => {
		setPrice(newValue as number[])

		const filteredProducts = exampleProducts.filter(
			product => product.price >= (newValue as number[])[0] && product.price <= (newValue as number[])[1]
		)

		setProducts(filteredProducts)
	}

	return (
		<div className='p-2 sm:col-span-2 col-span-3 row-span-8 bg-red-500'>
			<div className='p-2 px-4 border-2 border-black rounded-xl'>
				<h4 className='font-semibold'>Price</h4>
				<Slider
					getAriaLabel={() => 'Temperature range'}
					value={price}
					onChange={handlePriceChange}
					valueLabelDisplay='auto'
					getAriaValueText={valuetext}
					disableSwap
					min={50}
					step={5}
					max={5000}
				/>
			</div>
		</div>
	)
}

export default Filters

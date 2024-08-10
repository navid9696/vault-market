import { Checkbox, FormControlLabel, FormGroup, Slider } from '@mui/material'
import React, { Dispatch, SetStateAction, useState, useEffect, useCallback } from 'react'
import { ProductCardProps } from './ProductCard'
import { exampleProducts } from '~/data/exampleProducts'

interface FiltersProps {
	setProducts: Dispatch<SetStateAction<ProductCardProps[]>>
}

function valuetext(value: number) {
	return `${value}`
}

const minDistance = 1000

const Filters = ({ setProducts }: FiltersProps) => {
	const [price, setPrice] = useState<number[]>([50, 5000])
	const [checkedOnSale, setCheckedOnSale] = useState(false)
	const [checkedShowedUnavailable, setCheckedShowedUnavailable] = useState(false)

	useEffect(() => {
		let filteredProducts = exampleProducts.filter(
			product =>
				product.price >= price[0] && product.price <= price[1] && (product.available || checkedShowedUnavailable)
		)

		if (checkedOnSale) {
			filteredProducts = filteredProducts.filter(product => product.onSale === true)
		}

		setProducts(filteredProducts)
	}, [price, checkedOnSale, checkedShowedUnavailable, setProducts])

	const handlePriceChange = (event: Event, newValue: number | number[], activeThumb: number) => {
		if (!Array.isArray(newValue)) {
			return
		}

		if (activeThumb === 0) {
			const newMinPrice = Math.min(newValue[0], price[1] - minDistance)
			setPrice([newMinPrice, price[1]])
		} else {
			const newMaxPrice = Math.max(newValue[1], price[0] + minDistance)
			setPrice([price[0], newMaxPrice])
		}
	}

	return (
		<div className='p-2 sm:col-span-2 col-span-3 row-span-8 bg-red-500'>
			<div className='p-2 px-4 border-2 border-black rounded-xl'>
				<p className='font-semibold'>Price</p>
				<Slider
					getAriaLabel={() => 'Price range'}
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
			<FormGroup>
				<FormControlLabel
					label='ON SALE'
					control={
						<Checkbox
							checked={checkedOnSale}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedOnSale(e.target.checked)}
							inputProps={{ 'aria-label': 'controlled' }}
						/>
					}
				/>
				<FormControlLabel
					label='SHOW UNAVAILABLE'
					control={
						<Checkbox
							checked={checkedShowedUnavailable}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedShowedUnavailable(e.target.checked)}
							inputProps={{ 'aria-label': 'controlled' }}
						/>
					}
				/>
			</FormGroup>
		</div>
	)
}

export default Filters

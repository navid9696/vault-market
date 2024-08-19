import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Radio,
	RadioGroup,
	Rating,
	Slider,
	styled,
} from '@mui/material'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { ProductCardProps } from './ProductCard'
import { exampleProducts } from '~/data/exampleProducts'
import StarIcon from '@mui/icons-material/Star'

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
	const [checkedRating, setCheckedRating] = useState<string | number>('Any')

	useEffect(() => {
		let filteredProducts = exampleProducts.filter(
			product =>
				product.price >= price[0] && product.price <= price[1] && (product.available || checkedShowedUnavailable)
		)

		if (checkedOnSale) {
			filteredProducts = filteredProducts.filter(product => product.onSale === true)
		}

		if (checkedRating !== 'Any') {
			filteredProducts = filteredProducts.filter(product => product.rating === Number(checkedRating))
		}

		setProducts(filteredProducts)
	}, [price, checkedOnSale, checkedShowedUnavailable, checkedRating, setProducts])

	const handleRatingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = (e.target as HTMLInputElement).value
		setCheckedRating(value)

		let filteredProducts = [...exampleProducts]
		switch (value) {
			case 'Any':
				filteredProducts = filteredProducts.filter(product => product.rating >= 0)
				break
			case '5':
				filteredProducts = filteredProducts.filter(product => product.rating === 5)
				break
			case '4.5':
				filteredProducts = filteredProducts.filter(product => product.rating >= 4.5)
				break
			case '4':
				filteredProducts = filteredProducts.filter(product => product.rating >= 4)
				break
			case '3':
				filteredProducts = filteredProducts.filter(product => product.rating >= 3)
				break
		}
	}

	const handlePriceChange = (e: Event, newValue: number | number[], activeThumb: number) => {
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
		<div className='h-full flex flex-col justify-around  px-2 py-8 bg-red-500'>
			<div className='p-2 px-6 border-2 border-black rounded-xl'>
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

			<FormGroup className='flex flex-col justify-center gap-5'>
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

			<FormControl>
				<FormLabel className='font-semibold' id='demo-radio-buttons-group-label'>
					Ratings
				</FormLabel>
				<RadioGroup
					className='h-full flex flex-col gap-5'
					aria-labelledby='demo-radio-buttons-group-label'
					defaultValue='Any'
					onChange={handleRatingsChange}
					name='radio-buttons-group'>
					<FormControlLabel value={'Any'} control={<Radio />} label='Any' />

					<FormControlLabel
						value={5}
						control={<Radio />}
						label={
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className=''
								name='read-only'
								value={5}
								max={5}
								readOnly
							/>
						}
					/>
					<FormControlLabel
						value={4.5}
						control={<Radio />}
						label={
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className=''
								name='read-only'
								value={4.5}
								precision={0.5}
								max={5}
								readOnly
							/>
						}
					/>
					<FormControlLabel
						value={4}
						control={<Radio />}
						label={
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className=''
								name='read-only'
								value={4}
								max={5}
								readOnly
							/>
						}
					/>
					<FormControlLabel
						value={3}
						control={<Radio />}
						label={
							<StyledRating
								emptyIcon={<StarIcon fontSize='inherit' />}
								className=''
								name='read-only'
								value={3}
								max={5}
								readOnly
							/>
						}
					/>
				</RadioGroup>
			</FormControl>
		</div>
	)
}

export default Filters

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
import StarIcon from '@mui/icons-material/Star'
import { green } from '@mui/material/colors'
import { exampleProducts } from '~/data/exampleProducts'

const StyledRating = styled(Rating)({
	'& .MuiRating-iconFilled': {
		color: '#16a34a',
		filter: 'drop-shadow(1px 0.75px 0px rgb(0 0 0 / 1))',
	},
	'& .MuiRating-iconEmpty': {
		color: '#71717a',
		fill: 'black',
	},
})

interface FiltersProps {
	searchTerm: string
	setFilteredProducts: Dispatch<SetStateAction<ProductCardProps[]>>
}

function valuetext(value: number) {
	return `${value}`
}

const minDistance = 500

const Filters = ({ setFilteredProducts, searchTerm }: FiltersProps) => {
	const [price, setPrice] = useState<number[]>([50, 5000])
	const [checkedOnSale, setCheckedOnSale] = useState(false)
	const [checkedShowedUnavailable, setCheckedShowedUnavailable] = useState(false)
	const [checkedRating, setCheckedRating] = useState<string | number>('Any')

	useEffect(() => {
		let productsToFilter = [...exampleProducts]

		productsToFilter = productsToFilter.filter(product => product.price >= price[0] && product.price <= price[1])

		if (!checkedShowedUnavailable) {
			productsToFilter = productsToFilter.filter(product => product.available === true)
		}

		if (checkedOnSale) {
			productsToFilter = productsToFilter.filter(product => product.onSale)
		} else {
		}

		if (checkedRating !== 'Any') {
			productsToFilter = productsToFilter.filter(product => product.rating >= Number(checkedRating))
		}
		

		setFilteredProducts(productsToFilter)
	}, [price, checkedOnSale, checkedShowedUnavailable, checkedRating, setFilteredProducts, searchTerm])

	const handleRatingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = (e.target as HTMLInputElement).value
		setCheckedRating(value)

		let filteredProducts = [...exampleProducts]
		switch (value) {
			case 'Any':
				filteredProducts = filteredProducts.filter(product => product.rating === 0)
				break
			case '5':
				filteredProducts = filteredProducts.filter(product => product.rating === 5)
				break
			case '4.5':
				filteredProducts = filteredProducts.filter(product => product.rating === 4.5)
				break
			case '4':
				filteredProducts = filteredProducts.filter(product => product.rating === 4)
				break
			case '3':
				filteredProducts = filteredProducts.filter(product => product.rating === 3)
				break
			default:
				'Any'
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

	useEffect(() => {
		console.log('filtry')
	}, [])

	return (
		<div className='h-full px-4 py-8 flex flex-col justify-around text-green-600  bg-zinc-900'>
			<div className='p-2 px-6 border-2 border-green-600 rounded-xl'>
				<p className='text-lg font-semibold uppercase'>Price</p>
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
					color='success'
				/>
			</div>

			<FormGroup className='my-5 flex flex-col justify-center gap-2'>
				<FormControlLabel
					label='On sale %%%'
					control={
						<Checkbox
							checked={checkedOnSale}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedOnSale(e.target.checked)}
							inputProps={{ 'aria-label': 'controlled' }}
							sx={{
								color: green[800],
								'&.Mui-checked': {
									color: green[600],
								},
							}}
						/>
					}
				/>
				<FormControlLabel
					label='Show unavailable'
					control={
						<Checkbox
							checked={checkedShowedUnavailable}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedShowedUnavailable(e.target.checked)}
							inputProps={{ 'aria-label': 'controlled' }}
							sx={{
								color: green[800],
								'&.Mui-checked': {
									color: green[600],
								},
							}}
						/>
					}
				/>
			</FormGroup>

			<FormControl>
				<FormLabel className='text-green-600 text-lg font-semibold uppercase' id='demo-radio-buttons-group-label'>
					Ratings
				</FormLabel>
				<RadioGroup
					className='h-full flex flex-col gap-2'
					aria-labelledby='demo-radio-buttons-group-label'
					defaultValue='Any'
					onChange={handleRatingsChange}
					name='radio-buttons-group'>
					<FormControlLabel
						value={'Any'}
						control={
							<Radio
								sx={{
									color: green[800],
									'&.Mui-checked': {
										color: green[600],
									},
								}}
							/>
						}
						label='Any'
					/>

					<FormControlLabel
						value={5}
						control={
							<Radio
								sx={{
									color: green[800],
									'&.Mui-checked': {
										color: green[600],
									},
								}}
							/>
						}
						label={
							<div className='flex items-center justify-center gap-2'>
								<StyledRating
									emptyIcon={<StarIcon fontSize='inherit' />}
									className=''
									name='read-only'
									value={5}
									max={5}
									readOnly
								/>
								<span>5</span>
							</div>
						}
					/>
					<FormControlLabel
						value={4.5}
						control={
							<Radio
								sx={{
									color: green[800],
									'&.Mui-checked': {
										color: green[600],
									},
								}}
							/>
						}
						label={
							<div className='flex items-center justify-center gap-2'>
								<StyledRating
									emptyIcon={<StarIcon fontSize='inherit' />}
									className=''
									name='read-only'
									value={4.5}
									precision={0.5}
									max={5}
									readOnly
								/>
								<span>4.5+</span>
							</div>
						}
					/>
					<FormControlLabel
						value={4}
						control={
							<Radio
								sx={{
									color: green[800],
									'&.Mui-checked': {
										color: green[600],
									},
								}}
							/>
						}
						label={
							<div className='flex items-center justify-center gap-2'>
								<StyledRating
									emptyIcon={<StarIcon fontSize='inherit' />}
									className=''
									name='read-only'
									value={4}
									max={5}
									readOnly
								/>
								<span>4+</span>
							</div>
						}
					/>
					<FormControlLabel
						value={3}
						control={
							<Radio
								sx={{
									color: green[800],
									'&.Mui-checked': {
										color: green[600],
									},
								}}
							/>
						}
						label={
							<div className='flex items-center justify-center gap-2'>
								<StyledRating
									emptyIcon={<StarIcon fontSize='inherit' />}
									className=''
									name='read-only'
									value={3}
									max={5}
									readOnly
								/>
								<span>3+</span>
							</div>
						}
					/>
				</RadioGroup>
			</FormControl>
		</div>
	)
}

export default Filters

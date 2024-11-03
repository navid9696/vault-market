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
import React, { useEffect, useMemo, useCallback, useReducer, useState } from 'react'
import { ProductCardProps } from './ProductCard'
import StarIcon from '@mui/icons-material/Star'
import { green } from '@mui/material/colors'
import useStore from '~/store/useStore'
import { filtersReducer, initialState } from '~/reducers/filtersReducer'

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
	setFilteredProducts: (filtered: ProductCardProps[]) => void
}

function valuetext(value: number) {
	return `${value}`
}

const minDistance = 500

const ratingOptions = [
	{ value: 'Any', label: 'Any' },
	{ value: 5, label: '5', precision: 0.5 },
	{ value: 4.5, label: '4.5+', precision: 0.5 },
	{ value: 4, label: '4+', precision: 0.5 },
	{ value: 3, label: '3+', precision: 0.5 },
]

const Filters = ({ setFilteredProducts, searchTerm }: FiltersProps) => {
	const [state, dispatch] = useReducer(filtersReducer, initialState)
	const { activeCategory, activeSubCategory } = useStore()

	const [products, setProducts] = useState<ProductCardProps[]>([])

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const res = await fetch('http://localhost:3000/api/products')
				if (!res.ok) {
					throw new Error('Failed to fetch products')
				}
				const data: ProductCardProps[] = await res.json()
				setProducts(data)
				console.log('Data fetched')
			} catch (error) {
				console.error('Error fetching products:', error)
			}
		}

		loadProducts()
	}, [])

	const filteredProducts = useMemo(() => {
		return products.filter((product: ProductCardProps) => {
			const matchesPriceRange = product.price >= state.price[0] && product.price <= state.price[1]
			const matchesAvailability = state.checkedShowedUnavailable || product.available >0
			const matchesOnSale = !state.checkedOnSale || product.discount
			const matchesRating = state.checkedRating === 'Any' || product.rating  >= Number(state.checkedRating)
			const matchesCategory = !activeCategory || product.categoryId === activeCategory
			const matchesSubCategory = !activeSubCategory || product.subCategoryId === activeSubCategory
			const matchesSearchTerm = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())

			return (
				matchesPriceRange &&
				matchesAvailability &&
				matchesOnSale &&
				matchesRating &&
				matchesCategory &&
				matchesSubCategory &&
				matchesSearchTerm
			)
		})
	}, [
		products,
		state.price,
		state.checkedShowedUnavailable,
		state.checkedOnSale,
		state.checkedRating,
		activeCategory,
		activeSubCategory,
		searchTerm,
	])

	useEffect(() => {
		setFilteredProducts(filteredProducts)
	}, [filteredProducts, setFilteredProducts])

	const handleRatingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		dispatch({ type: 'SET_RATING_FILTER', payload: value })
	}

	const handlePriceChange = useCallback(
		(e: Event, newValue: number | number[], activeThumb: number) => {
			if (!Array.isArray(newValue)) return

			if (activeThumb === 0) {
				const newMinPrice = Math.min(newValue[0], state.price[1] - minDistance)
				dispatch({ type: 'SET_PRICE_FILTER', payload: [newMinPrice, state.price[1]] })
			} else {
				const newMaxPrice = Math.max(newValue[1], state.price[0] + minDistance)
				dispatch({ type: 'SET_PRICE_FILTER', payload: [state.price[0], newMaxPrice] })
			}
		},
		[state.price]
	)

	return (
		<div className='h-full px-4 py-8 flex flex-col justify-around text-green-600 bg-zinc-900'>
			<div className='p-2 px-6 border-2 border-green-600 rounded-xl'>
				<p className='text-lg font-semibold uppercase'>Price</p>
				<Slider
					getAriaLabel={() => 'Price range'}
					value={state.price}
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
					className='w-full'
					label={
						<div className='flex items-center gap-2'>
							<span>Discount</span>
						</div>
					}
					control={
						<Checkbox
							checked={state.checkedOnSale}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								dispatch({ type: 'SET_ON_SALE_FILTER', payload: !state.checkedOnSale })
							}
							inputProps={{
								'aria-label': state.checkedOnSale ? 'Uncheck to disable sale filter' : 'Check to filter items on sale',
							}}
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
							checked={state.checkedShowedUnavailable}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								dispatch({ type: 'SET_UNAVAILABLE_FILTER', payload: !state.checkedShowedUnavailable })
							}
							inputProps={{
								'aria-label': state.checkedShowedUnavailable
									? 'Uncheck to hide unavailable items'
									: 'Check to show unavailable items',
							}}
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
				<FormLabel
					sx={{
						'&.Mui-focused': {
							color: '#00d30b',
						},
					}}
					className='text-green-600 text-lg font-semibold uppercase'
					id='ratings-group-label'>
					Ratings
				</FormLabel>
				<RadioGroup
					className='h-full flex flex-col gap-2'
					aria-labelledby='ratings-group-label'
					defaultValue='Any'
					onChange={handleRatingsChange}
					name='radio-buttons-group'>
					{ratingOptions.map(rating => (
						<FormControlLabel
							key={rating.value}
							value={rating.value}
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
								rating.precision ? (
									<div className='flex items-center justify-center gap-2'>
										<StyledRating
											emptyIcon={<StarIcon fontSize='inherit' />}
											name='read-only'
											value={typeof rating.value === 'number' ? rating.value : 0}
											precision={rating.precision}
											max={5}
											readOnly
										/>
										<span>{rating.label}</span>
									</div>
								) : (
									rating.label
								)
							}
						/>
					))}
				</RadioGroup>
			</FormControl>
		</div>
	)
}

export default Filters

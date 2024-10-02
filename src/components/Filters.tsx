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
import React, { Dispatch, SetStateAction, useEffect, useMemo, useCallback, useReducer } from 'react'
import { ProductCardProps } from './ProductCard'
import StarIcon from '@mui/icons-material/Star'
import { green } from '@mui/material/colors'
import { exampleProducts } from '~/data/exampleProducts'
import { FaPercent } from 'react-icons/fa'
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
	setFilteredProducts: Dispatch<SetStateAction<ProductCardProps[]>>
}

function valuetext(value: number) {
	return `${value}`
}

const minDistance = 500

const Filters = ({ setFilteredProducts, searchTerm }: FiltersProps) => {
	const [state, dispatch] = useReducer(filtersReducer, initialState)
	const { reducerState } = useStore()

	const filteredProducts = useMemo(() => {
		return exampleProducts.filter(product => {
			const matchesPriceRange = product.price >= state.price[0] && product.price <= state.price[1]
			const matchesAvailability = state.checkedShowedUnavailable || product.available === true
			const matchesOnSale = !state.checkedOnSale || product.onSale
			const matchesRating = state.checkedRating === 'Any' || product.rating >= Number(state.checkedRating)
			const matchesCategory = !reducerState.activeCategory || product.categoryId === reducerState.activeCategory
			const matchesSubCategory =
				!reducerState.activeSubCategory || product.subCategoryId === reducerState.activeSubCategory
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
		state.price,
		state.checkedShowedUnavailable,
		state.checkedOnSale,
		state.checkedRating,
		reducerState.activeCategory,
		reducerState.activeSubCategory,
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
		<div className='h-full px-4 py-8 flex flex-col justify-around text-green-600  bg-zinc-900'>
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
							<span>On Sale</span>
							<FaPercent />
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
					id='demo-radio-buttons-group-label'>
					Ratings
				</FormLabel>
				<RadioGroup
					className='h-full flex flex-col gap-2'
					aria-labelledby='ratings-group-label'
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

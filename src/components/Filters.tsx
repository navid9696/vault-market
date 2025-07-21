'use client'

import React, { useEffect, useMemo, useCallback, useReducer } from 'react'
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
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import StarIcon from '@mui/icons-material/Star'
import { trpc } from '~/server/client'
import useStore from '~/store/useStore'
import { filtersReducer, initialState } from '~/reducers/filtersReducer'
import type { ProductCardProps } from './ProductCard'

const StyledRating = styled(Rating)(({ theme }) => ({
	'& .MuiRating-iconFilled': {
		color: theme.palette.primary.main,
		filter: 'drop-shadow(1px 0.75px 0px rgb(0 0 0 / 0.5))',
	},
	'& .MuiRating-iconEmpty': {
		color: theme.palette.background.default,
		fill: theme.palette.background.paper,
	},
}))

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

interface FiltersProps {
	searchTerm: string
	setFilteredProducts: (filtered: ProductCardProps[]) => void
}

export default function Filters({ setFilteredProducts, searchTerm }: FiltersProps) {
	const theme = useTheme()
	const [state, dispatch] = useReducer(filtersReducer, initialState)
	const { activeCategory, activeSubCategory } = useStore()
	const { data: products } = trpc.product.getProducts.useQuery({})

	const filteredProducts = useMemo(() => {
		return (
			products?.filter(product => {
				const matchesPriceRange = product.price >= state.price[0] && product.price <= state.price[1]
				const matchesAvailability = state.checkedShowedUnavailable || product.available > 0
				const matchesOnSale = !state.checkedOnSale || product.discount
				const matchesRating = state.checkedRating === 'Any' || product.rating >= Number(state.checkedRating)
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
			}) || []
		)
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
		dispatch({ type: 'SET_RATING_FILTER', payload: e.target.value })
	}

	const handlePriceChange = useCallback(
		(e: Event, newValue: number | number[], activeThumb: number) => {
			if (!Array.isArray(newValue)) return
			if (activeThumb === 0) {
				const newMin = Math.min(newValue[0], state.price[1] - minDistance)
				dispatch({ type: 'SET_PRICE_FILTER', payload: [newMin, state.price[1]] })
			} else {
				const newMax = Math.max(newValue[1], state.price[0] + minDistance)
				dispatch({ type: 'SET_PRICE_FILTER', payload: [state.price[0], newMax] })
			}
		},
		[state.price]
	)

	return (
		<div className='h-full px-4 py-8 flex flex-col justify-around bg-bg' style={{ color: theme.palette.text.primary }}>
			<div className='p-2 px-6 border-2 border-border rounded-xl'>
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
					color='primary'
				/>
			</div>

			<FormGroup className='my-5 flex flex-col justify-center gap-2'>
				<FormControlLabel
					className='w-full'
					sx={{ color: theme.palette.text.primary }}
					label='Discount'
					control={
						<Checkbox
							checked={state.checkedOnSale}
							onChange={() => dispatch({ type: 'SET_ON_SALE_FILTER', payload: !state.checkedOnSale })}
							sx={{
								color: theme.palette.text.secondary,
								'&.Mui-checked': { color: theme.palette.primary.main },
							}}
						/>
					}
				/>
				<FormControlLabel
					sx={{ color: theme.palette.text.primary }}
					label='Show unavailable'
					control={
						<Checkbox
							checked={state.checkedShowedUnavailable}
							onChange={() => dispatch({ type: 'SET_UNAVAILABLE_FILTER', payload: !state.checkedShowedUnavailable })}
							sx={{
								color: theme.palette.text.secondary,
								'&.Mui-checked': { color: theme.palette.primary.main },
							}}
						/>
					}
				/>
			</FormGroup>

			<FormControl>
				<FormLabel
					id='ratings-group-label'
					sx={{
						color: theme.palette.text.primary,
						fontWeight: 'bold',
						'&.Mui-focused': { color: theme.palette.primary.main },
					}}>
					Ratings
				</FormLabel>
				<RadioGroup
					aria-labelledby='ratings-group-label'
					className='h-full flex flex-col gap-2'
					defaultValue='Any'
					onChange={handleRatingsChange}
					name='radio-buttons-group'>
					{ratingOptions.map(opt => (
						<FormControlLabel
							key={opt.value}
							sx={{ color: theme.palette.text.primary }}
							value={opt.value}
							control={
								<Radio
									sx={{
										color: theme.palette.text.secondary,
										'&.Mui-checked': { color: theme.palette.primary.main },
									}}
								/>
							}
							label={
								opt.precision ? (
									<div className='flex items-center gap-2'>
										<StyledRating
											emptyIcon={<StarIcon fontSize='inherit' />}
											value={typeof opt.value === 'number' ? opt.value : 0}
											precision={opt.precision}
											max={5}
											readOnly
										/>
										<span>{opt.label}</span>
									</div>
								) : (
									opt.label
								)
							}
						/>
					))}
				</RadioGroup>
			</FormControl>
		</div>
	)
}

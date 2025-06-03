import {
	Autocomplete,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material'
import { ProductCardProps } from './ProductCard'
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'

interface SortAndSearchProps {
	filteredProducts: ProductCardProps[]
	setProducts: (products: ProductCardProps[]) => void
	setSearchTerm: (term: string) => void
	handleDrawer: (isOpen: boolean) => () => void
}

type SortOption =
	| 'popularity-asc'
	| 'popularity-desc'
	| 'name-asc'
	| 'name-desc'
	| 'price-asc'
	| 'price-desc'
	| 'rating-asc'
	| 'rating-desc'

const SortAndSearch = ({ setProducts, handleDrawer, filteredProducts, setSearchTerm }: SortAndSearchProps) => {
	const [sortOption, setSortOption] = useState<SortOption>('popularity-desc')

	const sortProducts = (products: ProductCardProps[], sort: SortOption) => {
		const sortedProducts = [...products]
		switch (sort) {
			case 'popularity-asc':
				sortedProducts.sort((a, b) => a.popularity - b.popularity)
				break
			case 'popularity-desc':
				sortedProducts.sort((a, b) => b.popularity - a.popularity)
				break
			case 'name-asc':
				sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
				break
			case 'name-desc':
				sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
				break
			case 'price-asc':
				sortedProducts.sort((a, b) => a.price - b.price)
				break
			case 'price-desc':
				sortedProducts.sort((a, b) => b.price - a.price)
				break
			case 'rating-asc':
				sortedProducts.sort((a, b) => a.rating - b.rating)
				break
			case 'rating-desc':
				sortedProducts.sort((a, b) => b.rating - a.rating)
				break
			default:
				break
		}
		return sortedProducts
	}

	const sortedProducts = useMemo(() => {
		return sortProducts(filteredProducts, sortOption)
	}, [filteredProducts, sortOption])

	useEffect(() => {
		setProducts(sortedProducts)
	}, [setProducts, sortedProducts])

	const handleSortChange = useCallback(
		(e: SelectChangeEvent<string>) => {
			const value = e.target.value
			setSortOption(value as SortOption)
		},
		[setSortOption]
	)

	const handleInputChange = useCallback(
		(e: SyntheticEvent<Element, Event>, value: string) => setSearchTerm(value),
		[setSearchTerm]
	)

	return (
		<div className='h-full p-2 flex gap-x-4 justify-evenly items-center'>
			<Button
				variant='outlined'
				className='text-surface hover:border-black border-border border bg-primary hover:bg-focus xl:hidden'
				onClick={handleDrawer(true)}>
				Filters
			</Button>

			<Autocomplete
				freeSolo
				autoHighlight
				handleHomeEndKeys
				size='small'
				className='text-text w-32'
				options={filteredProducts}
				getOptionLabel={product => (product as ProductCardProps).name}
				onInputChange={handleInputChange}
				renderInput={params => <TextField {...params} label='Search' variant='outlined' />}
			/>

			<FormControl className='w-52 focus:bg-focus focus:border-bg'>
				<InputLabel id='demo-simple-select-label'>Sort</InputLabel>
				<Select
					className='focus:border-bg'
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					label='Sort'
					size='small'
					value={sortOption}
					onChange={handleSortChange}>
					<MenuItem value='popularity-asc'>Popularity Ascending</MenuItem>
					<MenuItem value='popularity-desc'>Popularity Descending</MenuItem>
					<MenuItem value='name-asc'>Name A-Z</MenuItem>
					<MenuItem value='name-desc'>Name Z-A</MenuItem>
					<MenuItem value='price-asc'>Price Ascending</MenuItem>
					<MenuItem value='price-desc'>Price Descending</MenuItem>
					<MenuItem value='rating-asc'>Rating Ascending</MenuItem>
					<MenuItem value='rating-desc'>Rating Descending</MenuItem>
				</Select>
			</FormControl>
		</div>
	)
}

export default SortAndSearch

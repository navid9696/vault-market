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
import { Dispatch, SetStateAction, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { exampleProducts } from '~/data/exampleProducts'

interface SortAndSearchProps {
	filteredProducts: ProductCardProps[]
	setProducts: Dispatch<SetStateAction<ProductCardProps[]>>
	setSearchTerm: Dispatch<SetStateAction<string>>
	toggleDrawer: (newOpen: boolean) => () => void
}

const SortAndSearch = ({ setProducts, toggleDrawer, filteredProducts, setSearchTerm }: SortAndSearchProps) => {
	const [sortOption, setSortOption] = useState('popularity-desc')

	useEffect(() => {
		let sortedProducts = [...filteredProducts]

		switch (sortOption) {
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

		setProducts(sortedProducts)
	}, [sortOption, filteredProducts, setProducts])

	const handleSortChange = useCallback(
		(e: SelectChangeEvent<string>) => {
			const value = e.target.value
			setSortOption(value)
		},
		[setSortOption]
	)

	const handleInputChange = useCallback(
		(e: SyntheticEvent<Element, Event>, value: string) => setSearchTerm(value),
		[setSearchTerm]
	)

	return (
		<div
			className={`p-2 flex gap-x-4 justify-evenly items-center 
				 xl:col-span-7 col-span-10
			 row-span-1 bg-green-700 `}>
			<Button
				variant='outlined'
				className='text-zinc-900 hover:border-black border-black/25 border bg-green-700 hover:bg-green-600 xl:hidden'
				onClick={toggleDrawer(true)}>
				Filters
			</Button>

			<Autocomplete
				freeSolo
				autoHighlight
				handleHomeEndKeys
				size='small'
				className='bg-green-700 w-32'
				options={[...exampleProducts]}
				getOptionLabel={product => (product as ProductCardProps).name}
				onInputChange={handleInputChange}
				renderInput={params => <TextField {...params} label='Search' variant='outlined' />}
			/>

			<FormControl className='w-52 focus:bg-black focus:border-black'>
				<InputLabel id='demo-simple-select-label'>Sort</InputLabel>
				<Select
					className='focus:border-black'
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					label='Sort'
					size='small'
					value={sortOption}
					onChange={handleSortChange}>
					<MenuItem value='popularity-asc'>Popularity Ascdending</MenuItem>
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

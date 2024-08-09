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
import { Dispatch, SetStateAction, useState } from 'react'
import { exampleProducts } from './ProductsBrowsing'
import useStore from '~/store/useStore'

interface SortAndSearchProps {
	products: ProductCardProps[]
	setProducts: Dispatch<SetStateAction<ProductCardProps[]>>
}

const SortAndSearch = ({ products, setProducts }: SortAndSearchProps) => {
	const [sortOption, setSortOption] = useState<string>('')
	const setFiltersOpen = useStore(state => state.setFiltersOpen)
	const filtersOpen = useStore(state => state.filtersOpen)

	const handleSortChange = (e: SelectChangeEvent<string>) => {
		const value = e.target.value
		setSortOption(value)

		let sortedProducts
		switch (value) {
			case 'name-asc':
				sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name))
				break
			case 'name-desc':
				sortedProducts = [...products].sort((a, b) => b.name.localeCompare(a.name))
				break
			case 'price-asc':
				sortedProducts = [...products].sort((a, b) => a.price - b.price)
				break
			case 'price-desc':
				sortedProducts = [...products].sort((a, b) => b.price - a.price)
				break
			case 'rating-asc':
				sortedProducts = [...products].sort((a, b) => a.rating - b.rating)
				break
			case 'rating-desc':
				sortedProducts = [...products].sort((a, b) => b.rating - a.rating)
				break
			default:
				sortedProducts = products
		}

		setProducts(sortedProducts)
	}

	return (
		<div
			className={`flex justify-evenly items-center ${
				filtersOpen ? 'sm:col-span-8 col-span-7' : 'col-span-10'
			} row-span-1 bg-green-500`}>
			<Button onClick={() => setFiltersOpen(!filtersOpen)}>Filters</Button>

			<Autocomplete
				freeSolo
				autoHighlight
				handleHomeEndKeys
				size='small'
				className='w-52'
				options={exampleProducts}
				getOptionLabel={product => (product as ProductCardProps).name}
				onInputChange={(e, value) => {
					const filteredProducts = exampleProducts.filter(product =>
						product.name.toLowerCase().includes(value.toLowerCase())
					)
					setProducts(filteredProducts)
				}}
				renderInput={params => <TextField {...params} label='Search' variant='outlined' />}
			/>

			<FormControl className='w-40'>
				<InputLabel id='demo-simple-select-label'>Sort</InputLabel>
				<Select
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					label='Sort'
					value={sortOption}
					onChange={handleSortChange}>
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

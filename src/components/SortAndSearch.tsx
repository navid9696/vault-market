import {
	Autocomplete,
	Button,
	Drawer,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material'
import { ProductCardProps } from './ProductCard'
import { Dispatch, SetStateAction, useState } from 'react'
// import useStore from '~/store/useStore'
import { exampleProducts } from '~/data/exampleProducts'
import Filters from './Filters'

interface SortAndSearchProps {
	products: ProductCardProps[]
	setProducts: Dispatch<SetStateAction<ProductCardProps[]>>
}

const SortAndSearch = ({ products, setProducts }: SortAndSearchProps) => {
	const [sortOption, setSortOption] = useState('popularity-desc')
	const [open, setOpen] = useState(false)

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen)
	}

	const handleSortChange = (e: SelectChangeEvent<string>) => {
		const value = e.target.value
		setSortOption(value)

		let sortedProducts
		switch (value) {
			case 'popularity-asc':
				sortedProducts = [...products].sort((a, b) => b.popularity - a.popularity)
				break
			case 'popularity-desc':
				sortedProducts = [...products].sort((a, b) => a.popularity - b.popularity)
				break
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
			className={`p-2 flex gap-x-4 justify-evenly items-center 
				 xl:col-span-7 col-span-10
			 row-span-1 bg-green-700 `}>
			<Button
				variant='outlined'
				className='text-zinc-900 hover:border-black border-black/25 border bg-green-700 hover:bg-green-600 xl:hidden'
				onClick={toggleDrawer(true)}>
				Filters
			</Button>

			<Drawer className='' open={open} onClose={toggleDrawer(false)}>
				<Filters setProducts={setProducts} />
			</Drawer>

			<Autocomplete
				freeSolo
				autoHighlight
				handleHomeEndKeys
				size='small'
				className='bg-green-700 w-32'
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

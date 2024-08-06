import React, { useCallback, useState } from 'react'
import {
	Autocomplete,
	TextField,
	Button,
	MenuItem,
	Select,
	SelectChangeEvent,
	InputLabel,
	FormControl,
} from '@mui/material'
import ProductCard, { ProductCardProps } from './ProductCard'

// Exampledata
const exampleProducts: ProductCardProps[] = [
	{ name: 'Stimpak', price: 1500, rating: 3 },
	{ name: 'Super Stimpak', price: 2100, rating: 4.5 },
	{ name: 'Buffout', price: 1200, rating: 2.5 },
	{ name: 'Med-x', price: 100, rating: 0.5 },
	{ name: 'Power Armor', price: 280, rating: 1.25 },
	{ name: 'Assault Rifle', price: 100, rating: 1.5 },
	{ name: 'Jet', price: 905, rating: 2.5 },
	{ name: '10mm', price: 1200, rating: 5 },
	{ name: 'Leather Armor', price: 1000, rating: 2.75 },
]

const ProductsBrowsing: React.FC = () => {
	const [filtersOpen, setFiltersOpen] = useState(false)
	const [products, setProducts] = useState<ProductCardProps[]>(exampleProducts)
	const [sortOption, setSortOption] = useState('')
	const [selectedProduct, setSelectedProduct] = useState<ProductCardProps | null>(null)

	const handleSortChange = useCallback(
		(e: SelectChangeEvent<string>) => {
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
		},
		[products]
	)

	return (
		<section
			id='products-browsing'
			className='px-2 pt-8 h-with-navbar w-full grid grid-cols-8 grid-rows-8 bg-slate-950'>
			{filtersOpen && <div className='h-full sm:col-span-1 col-span-3 row-span-8 bg-red-500'></div>}

			<div
				className={`flex justify-evenly items-center ${
					filtersOpen ? 'col-span-7' : 'col-span-8'
				} row-span-1 bg-green-500`}>
				<Button onClick={() => setFiltersOpen(prev => !prev)}>Filters</Button>

				<Autocomplete
					freeSolo
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					className='w-52'
					options={exampleProducts as ProductCardProps[]}
					getOptionLabel={product => (product as ProductCardProps).name}
					filterOptions={(products, state) =>
						products.filter(product => product.name.toLowerCase().includes(state.inputValue.toLowerCase()))
					}
					onChange={(e, value) => (value ? setSelectedProduct(value as ProductCardProps) : setSelectedProduct(null))}
					renderInput={params => <TextField {...params} label='Search' variant='outlined' />}
				/>
				<FormControl className='w-52'>
					<InputLabel id='demo-simple-select-label'>Sort</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						label='Sort'
						value={sortOption}
						onChange={handleSortChange}>
						<MenuItem value='name-asc'>Name A-Z</MenuItem>
						<MenuItem value='name-desc'>Name Z-A</MenuItem>
						<MenuItem value='price-asc'>Price Low-High</MenuItem>
						<MenuItem value='price-desc'>Price High-Low</MenuItem>
						<MenuItem value='rating-asc'>Rating Low-High</MenuItem>
						<MenuItem value='rating-desc'>Rating High-Low</MenuItem>
					</Select>
				</FormControl>
			</div>

			<div
				className={`flex flex-wrap justify-evenly ${
					filtersOpen ? 'col-span-7' : 'col-span-8'
				} row-span-9 bg-blue-500 overflow-y-scroll`}>
				{selectedProduct ? (
					<ProductCard
						key={selectedProduct.name}
						name={selectedProduct.name}
						price={selectedProduct.price}
						rating={selectedProduct.rating}
					/>
				) : (
					products.map(product => (
						<ProductCard key={product.name} name={product.name} price={product.price} rating={product.rating} />
					))
				)}
			</div>
		</section>
	)
}

export default ProductsBrowsing

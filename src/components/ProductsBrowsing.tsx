import { useEffect, useState } from 'react'

import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import { exampleProducts } from '~/data/exampleProducts'
import { Drawer } from '@mui/material'

const ProductsBrowsing = () => {
	const [products, setProducts] = useState<ProductCardProps[]>(exampleProducts)
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>([])
	const [open, setOpen] = useState(false)

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen)
	}

	useEffect(() => {
		console.log(products)
	}, [products])

	return (
		<section
			id='products-browsing'
			className='h-with-navbar w-full 
		grid grid-cols-10 grid-rows-8 bg-slate-950'>
			<div className='md:col-span-3 hidden xl:block row-span-8 bg-zinc-900 border-r-8 border-black'>
				<Filters setFilteredProducts={setFilteredProducts} searchTerm={searchTerm} />
			</div>

			<Drawer
				ModalProps={{
					keepMounted: true,
				}}
				className='xl:hidden'
				open={open}
				onClose={toggleDrawer(false)}>
				<Filters setFilteredProducts={setFilteredProducts} searchTerm={searchTerm} />
			</Drawer>

			<SortAndSearch
				products={products}
				setProducts={setProducts}
				toggleDrawer={toggleDrawer}
				filteredProducts={filteredProducts}
				setSearchTerm={setSearchTerm}
			/>
			<div
				className='py-1 flex flex-wrap justify-evenly
				border-t-8 border-black
					xl:col-span-7 col-span-10 row-span-9
				 bg-zinc-900 overflow-y-scroll'>
				{...products.map(product => (
					<ProductCard
						key={product.name}
						name={product.name}
						price={product.price}
						rating={product.rating}
						available={product.available}
						popularity={product.popularity}
						onSale={product.onSale}
					/>
				))}
			</div>
		</section>
	)
}

export default ProductsBrowsing

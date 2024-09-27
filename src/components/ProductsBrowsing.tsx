'use client'
import { useEffect, useState } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import { exampleProducts } from '~/data/exampleProducts'
import { Drawer } from '@mui/material'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import CategoriesTabs from './CategoriesTabs'

const ProductsBrowsing = () => {
	const [products, setProducts] = useState<ProductCardProps[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>([])
	const [open, setOpen] = useState(false)
	const { height, width } = useWindowDimensions()

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen)
	}

	return (
		<>
			<section
				id='products-browsing'
				className='h-with-navbar w-full
		grid grid-cols-10 grid-rows-12'>
				<div className='flex items-center justify-center col-span-10 row-span-2 xl:border-b-8 xl:border-black bg-zinc-900 '>
					<CategoriesTabs />
				</div>
				{width < 1280 ? (
					<Drawer
						ModalProps={{
							keepMounted: true,
						}}
						open={open}
						onClose={toggleDrawer(false)}>
						<Filters setFilteredProducts={setFilteredProducts} searchTerm={searchTerm} />
					</Drawer>
				) : (
					<div className='xl:col-span-3 hidden xl:block row-span-12 bg-zinc-900 border-r-8 border-black'>
						<Filters setFilteredProducts={setFilteredProducts} searchTerm={searchTerm} />
					</div>
				)}
				<div
					className=' xl:col-span-7 col-span-10
			 row-span-1
				  bg-green-700'>
					<SortAndSearch
						setProducts={setProducts}
						toggleDrawer={toggleDrawer}
						filteredProducts={filteredProducts}
						setSearchTerm={setSearchTerm}
					/>
				</div>
				{/* console.log(data) */}
				<div
					className='py-1 flex flex-wrap justify-evenly
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
							categoryId={product.categoryId}
							subCategoryId={product.subCategoryId}
							imgURL={product.imgURL}
							description={product.description}
						/>
					))}
				</div>
			</section>
		</>
	)
}

export default ProductsBrowsing

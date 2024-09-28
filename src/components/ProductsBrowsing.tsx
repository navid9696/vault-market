import { useEffect, useState } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import { exampleProducts } from '~/data/exampleProducts'
import { Drawer } from '@mui/material'
import CategoriesTabs from './CategoriesTabs'

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
	})

	return (
		<>
			<section
				id='products-browsing'
				className='h-with-navbar w-full
		grid grid-cols-10 grid-rows-12'>
				<div className='flex items-center justify-center col-span-10 row-span-2 xl:border-b-8 xl:border-black bg-zinc-900 '>
					<CategoriesTabs />
				</div>

				<Drawer
					className='block xl:hidden'
					ModalProps={{
						keepMounted: true,
					}}
					open={open}
					onClose={toggleDrawer(false)}>
					<Filters setFilteredProducts={setFilteredProducts} searchTerm={searchTerm} />
				</Drawer>

				<div className='hidden xl:block xl:border-r-8 xl:border-black xl:col-span-3 row-span-12'>
					<Filters setFilteredProducts={setFilteredProducts} searchTerm={searchTerm} />
				</div>

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
						/>
					))}
				</div>
			</section>
		</>
	)
}

export default ProductsBrowsing

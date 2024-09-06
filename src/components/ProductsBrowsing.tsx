import { useEffect, useState } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import { exampleProducts } from '~/data/exampleProducts'
import { Drawer } from '@mui/material'
import useWindowDimensions from '~/hooks/useWindowDimensions'

const ProductsBrowsing = () => {
	const [products, setProducts] = useState<ProductCardProps[]>(exampleProducts)
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>([])
	const [open, setOpen] = useState(false)
	const { height, width } = useWindowDimensions()

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen)
	}

	useEffect(()=>{
		console.log(products)
	})

	return (
		<section
			id='products-browsing'
			className='h-with-navbar w-full 
		grid grid-cols-10 grid-rows-8 bg-slate-950'>
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
				<div className='xl:col-span-3 hidden xl:block row-span-8 bg-zinc-900 border-r-8 border-black'>
					<Filters setFilteredProducts={setFilteredProducts} searchTerm={searchTerm} />
				</div>
			)}

			<SortAndSearch
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
						categoryId={product.categoryId}
						subCategoryId={product.subCategoryId}
					/>
				))}
			</div>
		</section>
	)
}

export default ProductsBrowsing

import { useState } from 'react'

import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import useStore from '~/store/useStore'

// Exampledata
export const exampleProducts: ProductCardProps[] = [
	{ name: 'Stimpak', price: 1500, rating: 3 },
	{ name: 'Super Stimpak', price: 4100, rating: 4.5 },
	{ name: 'Buffout', price: 1200, rating: 2.5 },
	{ name: 'Med-x', price: 100, rating: 0.5 },
	{ name: 'Power Armor', price: 2080, rating: 1.25 },
	{ name: 'Assault Rifle', price: 1000, rating: 1.5 },
	{ name: 'Jet', price: 905, rating: 2.5 },
	{ name: '10mm', price: 1200, rating: 5 },
	{ name: 'Leather Armor', price: 3000, rating: 2.75 },
]

const ProductsBrowsing = () => {
	const [products, setProducts] = useState<ProductCardProps[]>(exampleProducts)
	const filtersOpen = useStore(state => state.filtersOpen)

	return (
		<section id='products-browsing' className='h-with-navbar w-full grid grid-cols-10 grid-rows-8 bg-slate-950'>
			{filtersOpen && <Filters setProducts={setProducts} />}

			<SortAndSearch products={products} setProducts={setProducts} />

			<div
				className={`flex flex-wrap justify-evenly ${
					filtersOpen ? 'sm:col-span-8 col-span-7' : 'col-span-10'
				} row-span-9 bg-blue-500 overflow-y-scroll`}>
				{products.map(product => (
					<ProductCard key={product.name} name={product.name} price={product.price} rating={product.rating} />
				))}
			</div>
		</section>
	)
}

export default ProductsBrowsing

import { useState } from 'react'

import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import useStore from '~/store/useStore'
import { exampleProducts } from '~/data/exampleProducts'

const ProductsBrowsing = () => {
	const [products, setProducts] = useState<ProductCardProps[]>(exampleProducts)
	const filtersOpen = useStore(state => state.filtersOpen)

	return (
		<section id='products-browsing' className='h-with-navbar w-full grid grid-cols-10 grid-rows-8 bg-slate-950'>
			{filtersOpen && <Filters setProducts={setProducts} />}

			<SortAndSearch products={products} setProducts={setProducts} />

			<div
				className={`py-1 flex flex-wrap justify-evenly ${
					filtersOpen ? 'sm:col-span-8 col-span-7' : 'col-span-10'
				} row-span-9 bg-blue-500 overflow-y-scroll`}>
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

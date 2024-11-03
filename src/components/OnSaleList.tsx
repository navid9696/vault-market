import { useEffect, useState } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import Marquee from 'react-fast-marquee'

const DiscountList = () => {
	const [Products, setProducts] = useState<ProductCardProps[]>([])

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const res = await fetch('/api/products')
				if (!res.ok) {
					throw new Error('Failed to fetch products')
				}
				const data: ProductCardProps[] = await res.json()
				setProducts(data)
				console.log('Data fetched')
			} catch (error) {
				console.error('Error fetching products:', error)
			}
		}

		loadProducts()
	}, [])

	return (
		<section className='h-1/4 bg-slate-100'>
			<Marquee
				className='h-full bg-gradient-to-r from-zinc-950 via-zinc-900 to bg-zinc-950 border-2 border-green-600 shadow-[inset_0_0_10px_#16a34a]'
				play={true}
				pauseOnHover
				delay={1}>
				{Products.filter(product => product.available > 0 && product.discount > 0).map(product => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						price={product.price}
						rating={product.rating}
						available={product.available}
						popularity={product.popularity}
						discount={product.discount}
						imgURL={product.imgURL}
						description={product.description}
					/>
				))}
			</Marquee>
		</section>
	)
}

export default DiscountList

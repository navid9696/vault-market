import { exampleProducts } from '~/data/exampleProducts'
import ProductCard from './ProductCard'
import Marquee from 'react-fast-marquee'

const OnSaleList = () => {
	return (
		<section className='h-1/4 bg-slate-100'>
			<Marquee
				className='h-full bg-gradient-to-r from-zinc-950 via-zinc-900 to bg-zinc-950 border-2 border-green-600 shadow-[inset_0_0_10px_#16a34a]'
				play={true}
				pauseOnHover
				delay={1}>
				{exampleProducts
					.filter(product => product.available === true && product.onSale === true)
					.map((product, index) => (
						<ProductCard
							key={`${product.name}-${index}`}
							name={product.name}
							price={product.price}
							rating={product.rating}
							available={product.available}
							popularity={product.popularity}
							onSale={product.onSale}
						/>
					))}
			</Marquee>
		</section>
	)
}

export default OnSaleList

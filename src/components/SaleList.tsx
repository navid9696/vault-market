import ProductCard from './ProductCard'
import { Carousel } from 'nuka-carousel'

const SaleList = () => {
	return (
		<section className='h-1/4 w-full bg-slate-700'>
			<div className='h-full w-full'>
				<Carousel className='h-full'>
					<div className='h-full'>
						<ProductCard />
					</div>
					<div className='h-42'>
						<ProductCard />
					</div>
					<ProductCard />
					<ProductCard />
					<ProductCard />
				</Carousel>
			</div>
		</section>
	)
}

export default SaleList

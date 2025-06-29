import ProductCard from './ProductCard'
import Marquee from 'react-fast-marquee'
import { trpc } from '~/server/client'
import { CircularProgress } from '@mui/material'

const DiscountList = () => {
	const { data: products, isLoading, isError, error } = trpc.product.getProducts.useQuery({})

	const discounted = products?.filter(p => p.available > 0 && p.discount > 0) ?? []

	const wrapperClass = 'h-full bg-gradient-to-r from-bg via-surface to-bg border-2 border-border shadow-inner-shadow'

	return (
		<section className='h-1/4'>
			{isLoading || isError || discounted.length === 0 ? (
				<div className={`${wrapperClass} flex items-center justify-center`}>
					{isLoading && <CircularProgress />}
					{isError && <p className='text-text'>Error: {error.message}</p>}
					{!isLoading && !isError && discounted.length === 0 && <p className='text-text'>No discounted products</p>}
				</div>
			) : (
				<Marquee className={wrapperClass} play pauseOnHover delay={1}>
					{discounted.map(product => (
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
			)}
		</section>
	)
}

export default DiscountList

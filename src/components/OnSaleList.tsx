import ProductCard from './ProductCard'
import Marquee from 'react-fast-marquee'
import { trpc } from '~/server/client'
import { CircularProgress } from '@mui/material'

const DiscountList = () => {
	const { data: products, isLoading, isError, error } = trpc.product.getProducts.useQuery({});


	return (
		<section className='h-1/4'>
			{isError && (
				<div className='h-full p-2 flex justify-center items-center'>
					<p>Error:${error.message}</p>
				</div>
			)}
			{isLoading ? (
				<div className='h-full p-2 flex justify-center items-center'>
					<CircularProgress />
				</div>
			) : (
				<Marquee
					className='h-full bg-gradient-to-r from-bg via-surface to-bg border-2 border-border shadow-inner-shadow'
					play={true}
					pauseOnHover
					delay={1}>
					{products
						?.filter(product => product.available > 0 && product.discount > 0)
						.map(product => (
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

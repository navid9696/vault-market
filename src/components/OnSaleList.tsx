import ProductCard from './ProductCard'
import Marquee from 'react-fast-marquee'
import { trpc } from '~/server/client'
import { CircularProgress } from '@mui/material'

const DiscountList = () => {
	const { data: products, isLoading, isError, error } = trpc.product.getProducts.useQuery({});


	return (
		<section className='h-1/4 bg-slate-100'>
			{isError && (
				<div className='h-full p-2 flex justify-center items-center bg-gray-100'>
					<p>Error:${error.message}</p>
				</div>
			)}
			{isLoading ? (
				<div className='h-full p-2 flex justify-center items-center bg-gray-100'>
					<CircularProgress />
				</div>
			) : (
				<Marquee
					className='h-full bg-gradient-to-r from-zinc-950 via-zinc-900 to bg-zinc-950 border-2 border-green-600 shadow-[inset_0_0_10px_#16a34a]'
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

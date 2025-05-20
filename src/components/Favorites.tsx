import React from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import { trpc } from '~/server/client'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { CircularProgress } from '@mui/material'

const FavoritesList = () => {
	const { navHeight } = useNavigationHeight()
	const { data: favorites, isLoading, error } = trpc.favorite.getFavorites.useQuery()

	const products = favorites?.map(fav => fav.product)

	return (
		<div className='h-screen'>
			<div
				style={{ marginTop: `${navHeight}px` }}
				className='p-4 max-w-3xl w-screen h-with-navbar bg-bg text-text overflow-hidden'>
				<h2 className='mt-6 text-center text-2xl font-bold mb-4'>Your Favorite Products</h2>
				{error && <h2>Error: {error.message}</h2>}
				{(!favorites || favorites.length === 0) && !error && !isLoading && <h2>No favorites found.</h2>}
				{isLoading && !error && (
					<div className='flex flex-col items-center justify-center'>
						<h2 className='mb-5'>Loading favorites</h2>
						<CircularProgress />
					</div>
				)}
				<div
					className='h-full w-full flex flex-wrap gap-x-4 gap-y-2
         justify-center items-start content-start
         overflow-y-scroll'>
					{products?.map(product => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							price={product.price}
							rating={product.rating}
							available={product.available}
							popularity={product.popularity}
							discount={product.discount}
							categoryId={product.categoryId}
							subCategoryId={product.subCategoryId}
							categoryName={product.categoryName}
							subCategoryName={product.subCategoryName}
							imgURL={product.imgURL}
							description={product.description}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default FavoritesList

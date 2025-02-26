import React from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import { trpc } from '~/server/client'
import { useNavigationHeight } from '~/context/NavbarHeightContext'

const FavoritesList: React.FC = () => {
	const { navHeight } = useNavigationHeight()
	const { data: favorites, isLoading, error } = trpc.favorite.getFavorites.useQuery()

	if (isLoading) return <div>Loading favorites...</div>
	if (error) return <div>Error: {error.message}</div>
	if (!favorites || favorites.length === 0) return <div>No favorites found.</div>

	const products = favorites.map(fav => fav.product)

	return (
		<div className='h-screen'>
			<div style={{ marginTop: `${navHeight}px` }} className='p-4 max-w-3xl w-screen h-with-navbar bg-zinc-900'>
				<h2 className='text-2xl font-bold mb-4'>Your Favorite Products</h2>
				<div className='h-full w-full flex flex-wrap gap-4 justify-center overflow-y-scroll'>
					{products.map(product => (
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

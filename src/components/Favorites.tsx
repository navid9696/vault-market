'use client'

import React from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import { trpc } from '~/server/client'
import { CircularProgress } from '@mui/material'

const FavoritesList = () => {
	const { data: favorites, isLoading, error } = trpc.favorite.getFavorites.useQuery()
	const products = favorites?.map(fav => fav.product) ?? []

	return (
		<div className='h-screen flex flex-col'>
			<div style={{ height: 56 }} />

			<div className='flex-1 p-4 max-w-3xl w-screen bg-bg text-text flex flex-col min-h-0'>
				<h1 className='p-8 text-center text-3xl font-bold mb-4 border-b border-border uppercase'>
					Your Favorite Products
				</h1>

				{error && <h2 className='text-red-600'>Error: {error.message}</h2>}
				{!isLoading && products.length === 0 && !error && <h2>No favorites found.</h2>}

				{isLoading && !error && (
					<div className='flex-1 flex flex-col items-center justify-center'>
						<h2 className='mb-5'>Loading favorites</h2>
						<CircularProgress />
					</div>
				)}

				<div className='flex-1 overflow-y-auto min-h-0'>
					<div className='h-full w-full flex flex-wrap gap-x-4 gap-y-2 justify-center items-start'>
						{products.map(product => (
							<ProductCard key={product.id} {...(product as ProductCardProps)} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default FavoritesList

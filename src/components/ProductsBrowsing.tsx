import React, { useCallback, useReducer } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import { Drawer } from '@mui/material'
import CategoriesTabs from './CategoriesTabs'
import { initialState, productsReducer } from '~/reducers/productsReducer'

const ProductsBrowsing = () => {
	const [state, dispatch] = useReducer(productsReducer, initialState)
	const [open, setOpen] = React.useState(false)

	const openDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen)
	}

	return (
		<>
			<section
				id='products-browsing'
				className='h-with-navbar w-full
		grid grid-cols-10 grid-rows-12'>
				<div className='flex items-center justify-center col-span-10 row-span-2 xl:border-b-8 xl:border-black bg-zinc-900 '>
					<CategoriesTabs />
				</div>

				<Drawer
					className='block xl:hidden'
					ModalProps={{
						keepMounted: true,
					}}
					open={open}
					onClose={openDrawer(false)}>
					<Filters
						setFilteredProducts={useCallback(
							(filtered: ProductCardProps[]) => {
								dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered })
							},
							[dispatch]
						)}
						searchTerm={state.searchTerm}
					/>
				</Drawer>

				<div className='hidden xl:block xl:border-r-8 xl:border-black xl:col-span-3 row-span-12'>
					<Filters
						setFilteredProducts={useCallback(
							(filtered: ProductCardProps[]) => {
								dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered })
							},
							[dispatch]
						)}
						searchTerm={state.searchTerm}
					/>
				</div>

				<div className='xl:col-span-7 col-span-10 row-span-1 bg-green-700'>
					<SortAndSearch
						setProducts={useCallback(
							products => dispatch({ type: 'SET_PRODUCTS', payload: products as ProductCardProps[] }),
							[dispatch]
						)}
						openDrawer={openDrawer}
						filteredProducts={state.filteredProducts}
						setSearchTerm={useCallback(
							term => dispatch({ type: 'SET_SEARCH_TERM', payload: term as string }),
							[dispatch]
						)}
					/>
				</div>

				<div
					className='py-1 flex flex-wrap justify-evenly
					xl:col-span-7 col-span-10 row-span-9
				 bg-zinc-900 overflow-y-scroll'>
					{state.products.map(product => (
						<ProductCard
							key={product.name}
							name={product.name}
							price={product.price}
							rating={product.rating}
							available={product.available}
							popularity={product.popularity}
							onSale={product.onSale}
							categoryId={product.categoryId}
							subCategoryId={product.subCategoryId}
						/>
					))}
				</div>
			</section>
		</>
	)
}

export default ProductsBrowsing

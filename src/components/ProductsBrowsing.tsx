import { useEffect, useReducer, useRef, useState } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import { Drawer } from '@mui/material'
import CategoriesTabs from './CategoriesTabs'
import useProducts from '~/hooks/useProducts'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
<<<<<<< HEAD
import { initialState, showProductsReducer } from '~/reducers/showProductsReducer'
=======
import { initialState, setItemsToShow, setVisibleProducts, showProductsReducer } from '~/reducers/showProductsReducer'
>>>>>>> 1c857dc0b4304e13ecbfb5277d2025fd30c83202

const ProductsBrowsing = () => {
	const { products, searchTerm, filteredProducts, updateProducts, updateSearchTerm, updateFilteredProducts } =
		useProducts()
	const [open, setOpen] = useState(false)
	const sectionRef = useRef(null)
	const { navHeight } = useNavigationHeight()
	const loadMoreRef = useRef(null)
	const [state, dispatch] = useReducer(showProductsReducer, initialState)

	const handleDrawer = (isOpen: boolean) => () => {
		setOpen(isOpen)
	}

	const scrollToSection = () => {
		if (sectionRef.current) {
			const sectionPosition = (sectionRef.current as HTMLElement).getBoundingClientRect().top + window.scrollY
			window.scrollTo({
				top: sectionPosition - navHeight,
				behavior: 'smooth',
			})
		}
	}

	useEffect(() => {
		dispatch({ type: 'SET_VISIBLE_PRODUCTS', payload: products.slice(0, state.itemsToShow) })
	}, [products, state.itemsToShow])

	useEffect(() => {
		const loadMoreProducts = () => {
			const newItemsToShow = Math.min(state.itemsToShow + 3, products.length)
			dispatch({ type: 'SET_ITEMS_TO_SHOW', payload: newItemsToShow })
		}

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
<<<<<<< HEAD
					entry.isIntersecting && loadMoreProducts()
=======
					if (entry.isIntersecting) {
						loadMoreProducts()
					}
>>>>>>> 1c857dc0b4304e13ecbfb5277d2025fd30c83202
				})
			},
			{ threshold: 1.0 }
		)

		const currentLoadMoreRef = loadMoreRef.current

<<<<<<< HEAD
		currentLoadMoreRef && observer.observe(currentLoadMoreRef)

		return () => {
			currentLoadMoreRef && observer.unobserve(currentLoadMoreRef)
=======
		if (currentLoadMoreRef) {
			observer.observe(currentLoadMoreRef)
		}

		return () => {
			if (currentLoadMoreRef) {
				observer.unobserve(currentLoadMoreRef)
			}
>>>>>>> 1c857dc0b4304e13ecbfb5277d2025fd30c83202
		}
	}, [products, state.itemsToShow])

	return (
		<>
			<section
				ref={sectionRef}
				className='h-with-navbar w-full
		grid grid-cols-10 grid-rows-12'>
				<div className='flex items-center justify-center col-span-10 row-span-2 xl:border-b-8 xl:border-black bg-zinc-900 '>
					<CategoriesTabs scrollToSection={scrollToSection} />
				</div>

				<Drawer
					className='block xl:hidden'
					ModalProps={{
						keepMounted: true,
					}}
					open={open}
					onClose={handleDrawer(false)}>
					<Filters setFilteredProducts={updateFilteredProducts} searchTerm={searchTerm} />
				</Drawer>

				<div className='hidden xl:block xl:border-r-8 xl:border-black xl:col-span-3 row-span-12'>
					<Filters setFilteredProducts={updateFilteredProducts} searchTerm={searchTerm} />
				</div>

				<div className='xl:col-span-7 col-span-10 row-span-1 bg-green-700'>
					<SortAndSearch
						setProducts={updateProducts}
						handleDrawer={handleDrawer}
						filteredProducts={filteredProducts}
						setSearchTerm={updateSearchTerm}
					/>
				</div>

				<div
					className='py-1 flex flex-wrap justify-evenly
					xl:col-span-7 col-span-10 row-span-9
					bg-zinc-900 overflow-y-scroll'>
					{state.visibleProducts.map(product => (
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
					<div ref={loadMoreRef} className='h-10' />
				</div>
			</section>
		</>
	)
}

export default ProductsBrowsing

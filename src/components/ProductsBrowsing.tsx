import { useEffect, useReducer, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import SortAndSearch from './SortAndSearch'
import Filters from './Filters'
import { Drawer } from '@mui/material'
import CategoriesTabs from './CategoriesTabs'
import useProducts from '~/hooks/useProducts'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { initialState, showProductsReducer } from '~/reducers/showProductsReducer'

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
					entry.isIntersecting && loadMoreProducts()
				})
			},
			{ threshold: 1.0 }
		)

		const currentLoadMoreRef = loadMoreRef.current

		currentLoadMoreRef && observer.observe(currentLoadMoreRef)

		return () => {
			currentLoadMoreRef && observer.unobserve(currentLoadMoreRef)
		}
	}, [products, state.itemsToShow])

	return (
		<>
			<section
				ref={sectionRef}
				className='h-with-navbar w-full
		grid grid-cols-10 grid-rows-12'>
				<div className='flex items-center justify-center col-span-10 row-span-2 xl:border-b-8 xl:border-black bg-bg '>
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

				<div className='xl:col-span-7 col-span-10 row-span-1 bg-surface'>
					<SortAndSearch
						setProducts={updateProducts}
						handleDrawer={handleDrawer}
						filteredProducts={filteredProducts}
						setSearchTerm={updateSearchTerm}
					/>
				</div>

				<div
					className='py-1 flex flex-wrap justify-center items-start content-start
					xl:col-span-7 col-span-10 row-span-9
					bg-bg overflow-y-scroll'>
					{state.visibleProducts.map(product => (
						<ProductCard
							id={product.id}
							key={product.name}
							name={product.name}
							price={product.price}
							rating={product.rating}
							available={product.available}
							popularity={product.popularity}
							discount={product.discount}
							categoryId={product.categoryId}
							subCategoryId={product.subCategoryId}
							imgURL={product.imgURL}
							description={product.description}
						/>
					))}
					<div ref={loadMoreRef} className='h-10' />
				</div>
			</section>
		</>
	)
}

export default ProductsBrowsing

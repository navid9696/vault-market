import { useRef, useEffect, useState } from 'react'
import AdminProductCard from './AdminProductCard'
import { CircularProgress } from '@mui/material'
import { ProductCardProps } from './ProductCard'

export interface ProductListProps {
	products: ProductCardProps[]
	isLoading: boolean
}

const ProductList = ({ products, isLoading }: ProductListProps) => {
	const [itemsToShow, setItemsToShow] = useState(10)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const loadMoreProducts = () => {
			if (products && itemsToShow < products.length) {
				setItemsToShow(prev => Math.min(prev + 10, products.length))
			}
		}

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) loadMoreProducts()
				})
			},
			{ threshold: 1.0 }
		)

		const currentRef = loadMoreRef.current
		if (currentRef) observer.observe(currentRef)

		return () => {
			if (currentRef) observer.unobserve(currentRef)
		}
	}, [products, itemsToShow])

	if (isLoading) {
		return (
			<div className='flex justify-center items-center'>
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className='w-full flex flex-wrap gap-4 justify-center'>
			{products
				.slice(Math.max(0, products.length - itemsToShow))
				.reverse()
				.map(product => (
					<AdminProductCard
						id={product.id}
						key={product.id}
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
						categoryName={product.categoryName}
						subCategoryName={product.subCategoryName}
					/>
				))}
			<div ref={loadMoreRef} className='h-2'></div>
		</div>
	)
}

export default ProductList

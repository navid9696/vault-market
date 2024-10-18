'use client'

import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import AdminProductCard from '~/components/AdminProductCard'
import AddProductCard from '~/components/AddProductCard'
import { ProductCardProps } from '~/components/ProductCard'

const Products = () => {
	const [products, setProducts] = useState<ProductCardProps[]>([])
	const [showAddProductForm, setShowAddProductForm] = useState(false)

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const res = await fetch('http://localhost:3000/api/products')
				if (!res.ok) {
					throw new Error('Failed to fetch products')
				}
				const data = await res.json()
				setProducts(data)
				console.log('Data fetched')
			} catch (error) {
				console.error('Error fetching products:', error)
			}
		}

		loadProducts()
	}, [])

	const handleAddProduct = async (newProduct: ProductCardProps) => {
		try {
			console.log('Adding product:', newProduct)
			const res = await fetch('http://localhost:3000/api/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newProduct),
			})

			if (!res.ok) {
				throw new Error('Failed to add product')
			}

			const addedProduct = await res.json()
			setProducts(prevProducts => [...prevProducts, addedProduct])
		} catch (error) {
			console.error('Error adding product:', error)
		}
	}

	return (
		<div className='h-screen flex justify-center items-center'>
			<div className='border'>
				<h1 className='uppercase'>Total Products</h1>
				<Button onClick={() => setShowAddProductForm(prev => !prev)}>
					{showAddProductForm ? 'Cancel' : 'Add New Product'}
				</Button>
				{showAddProductForm && <AddProductCard onAddProduct={handleAddProduct} />}
				<div className='border h-96 w-96 flex flex-wrap overflow-scroll'>
					{products.map(product => (
						<AdminProductCard
							key={product.name}
							name={product.name}
							price={product.price}
							rating={product.rating}
							available={product.available}
							popularity={product.popularity}
							onSale={product.onSale}
							categoryId={product.categoryId}
							subCategoryId={product.subCategoryId}
							imgURL={product.imgURL}
							description={product.description}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default Products

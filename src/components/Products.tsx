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
		<div className='p-2 h-screen flex justify-center items-center bg-gray-100'>
			<div className='border border-gray-300 rounded-lg p-6 bg-white shadow-lg w-full max-w-screen-2xl'>
				<h1 className='uppercase text-2xl font-semibold mb-4 text-center'>Total Products</h1>
				<div className='flex justify-center mb-6'>
					<Button
						onClick={() => setShowAddProductForm(prev => !prev)}
						className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'>
						{showAddProductForm ? 'Cancel' : 'Add New Product'}
					</Button>
				</div>
				{showAddProductForm && (
					<div className='mb-6'>
						<AddProductCard onAddProduct={handleAddProduct} />
					</div>
				)}
				<div className='border-t border-gray-200 pt-4 mt-4'>
					<div className='h-96 w-full flex flex-wrap gap-4 overflow-y-auto'>
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
		</div>
	)
}

export default Products


import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '~/lib/mongoose'
import Product from '../../../../../models/Product'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	await connectToDB()
	const { id: productId } = params

	try {
		const product = await Product.findOne({ id: productId })
		if (!product) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 })
		}
		return NextResponse.json(product)
	} catch (error) {
		console.error('Error fetching product:', error)
		return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
	}
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	await connectToDB()
	const { id: productId } = params

	try {
		const body = await req.json()
		const updatedProduct = await Product.findOneAndUpdate({ id: productId }, body, { new: true })
		if (!updatedProduct) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProduct, { status: 200 })
	} catch (error) {
		console.error('Error updating product:', error)
		return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	await connectToDB()
	const { id: productId } = params

	try {
		const deletedProduct = await Product.findOneAndDelete({ id: productId })
		if (!deletedProduct) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 })
		}
		return NextResponse.json({ message: 'Product deleted successfull' }, { status: 200 })
	} catch (error) {
		console.error('Error deleting product:', error)
		return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
	}
}

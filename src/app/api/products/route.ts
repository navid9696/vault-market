import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '~/lib/mongoose'
import Product from '../../../../models/Product'

export async function GET(req: NextRequest) {
	await connectToDB()
	try {
		const products = await Product.find()
		return NextResponse.json(products)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	await connectToDB()
	try {
		const body = await req.json()
		const newProduct = new Product(body)
		await newProduct.save()
		return NextResponse.json(newProduct, { status: 201 })
	} catch (error) {
		return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest) {
	await connectToDB()
	try {
		const productId = req.nextUrl.searchParams.get('id')
		if (!productId) {
			return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
		}

		const deletedProduct = await Product.findByIdAndDelete(productId)
		if (!deletedProduct) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
	}
}

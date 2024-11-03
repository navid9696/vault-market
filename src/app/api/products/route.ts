import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '~/lib/mongoose'
import Product from '../../../../models/Product'

export async function POST(req: NextRequest) {
	await connectToDB()
	try {
		const body = await req.json()
		const newProduct = new Product(body)
		await newProduct.save()
		return NextResponse.json(newProduct, { status: 201 })
	} catch (error) {
		console.error('Error adding product:', error)
		return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
	}
}



export async function GET(req: NextRequest) {
	await connectToDB()
	try {
		const products = await Product.find()
		return NextResponse.json(products)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
	}
}

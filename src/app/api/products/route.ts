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


export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import cloudinary from '~/lib/cloudinary'

function uploadBufferToCloudinary(buffer: Buffer, folder: string) {
	return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder,
				resource_type: 'image',
				use_filename: true,
				unique_filename: false,
			},
			(error, result) => {
				if (error || !result) return reject(error)
				resolve({ secure_url: result.secure_url, public_id: result.public_id })
			},
		)

		stream.end(buffer)
	})
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()
		const file = formData.get('file') as File | null

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		const MAX_SIZE = 8 * 1024 * 1024
		if (file.size > MAX_SIZE) {
			return NextResponse.json({ error: 'File too large (max 8MB)' }, { status: 413 })
		}

		const allowed = new Set(['image/png', 'image/jpeg', 'image/webp'])
		if (!allowed.has(file.type)) {
			return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
		}

		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		const uploaded = await uploadBufferToCloudinary(buffer, 'products')

		return NextResponse.json({
			secure_url: uploaded.secure_url,
			public_id: uploaded.public_id,
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
	}
}

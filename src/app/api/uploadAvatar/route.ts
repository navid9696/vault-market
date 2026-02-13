export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import cloudinary from '~/lib/cloudinary'

function uploadBufferToCloudinary(buffer: Buffer, folder: string) {
	return new Promise<{ secure_url: string }>((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder,
				resource_type: 'image',
				use_filename: true,
				unique_filename: false,
			},
			(error, result) => {
				if (error || !result) {
					return reject(error)
				}
				resolve({ secure_url: result.secure_url })
			},
		)

		stream.end(buffer)
	})
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()
		const file = formData.get('avatar') as File | null

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		const MAX_SIZE = 5 * 1024 * 1024
		if (file.size > MAX_SIZE) {
			return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 })
		}

		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		const uploaded = await uploadBufferToCloudinary(buffer, 'avatars')

		return NextResponse.json({ url: uploaded.secure_url })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
	}
}

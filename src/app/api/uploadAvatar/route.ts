import { UploadApiResponse } from 'cloudinary'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import cloudinary from '~/lib/cloudinary'

export const config = {
	api: { bodyParser: false },
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()
		const file = formData.get('avatar') as File | null
		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		const base64 = buffer.toString('base64')
		const dataUri = `data:${file.type};base64,${base64}`

		const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
			folder: 'avatars',
			resource_type: 'image',
			use_filename: true,
			unique_filename: false,
		})

		return NextResponse.json({ url: result.secure_url })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
	}
}

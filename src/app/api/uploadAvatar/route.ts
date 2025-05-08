import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
	const formData = await req.formData()
	const file = formData.get('avatar') as Blob | null
	if (!file || !(file instanceof Blob)) {
		return NextResponse.json({ error: 'No file provided' }, { status: 400 })
	}
	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)

	const originalName = (file as any).name as string
	const fileName = `${Date.now()}-${originalName}`
	const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')

	await fs.promises.mkdir(uploadDir, { recursive: true })
	await fs.promises.writeFile(path.join(uploadDir, fileName), buffer)

	return NextResponse.json({ url: `/uploads/avatars/${fileName}` })
}

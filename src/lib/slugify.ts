export const slugify = (input: string): string => {
	if (input == null) throw new Error('InvalidInput')
	const pre = input.replace(/ł|Ł/g, 'l')
	const s = pre
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-+/g, '-')
	return s
}

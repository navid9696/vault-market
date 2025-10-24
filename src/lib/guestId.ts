export const ensureGuestId = (): string => {
	if (typeof window === 'undefined') return ''
	const m = document.cookie.match(/(?:^|;\s*)gid=([^;]+)/)
	if (m?.[1]) return m[1]
	const gid = crypto.randomUUID()
	document.cookie = `gid=${gid}; Path=/; Max-Age=15552000; SameSite=Lax`
	return gid
}

export const getGuestId = (): string => {
	if (typeof window === 'undefined') return ''
	const m = document.cookie.match(/(?:^|;\s*)gid=([^;]+)/)
	return m?.[1] ?? ''
}

export const clearGuestId = (): void => {
	if (typeof window === 'undefined') return
	document.cookie = `gid=; Path=/; Max-Age=0; SameSite=Lax`
}

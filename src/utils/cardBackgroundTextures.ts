export const CARD_BACKGROUNDTEXTURES = [
	'/imgs/card-texture-1.png',
	'/imgs/card-texture-2.png',
	'/imgs/card-texture-3.png',
	'/imgs/card-texture-4.png',
	'/imgs/card-texture-5.png',
	'/imgs/card-texture-6.png',
	'/imgs/card-texture-7.png',
	'/imgs/card-texture-8.png',
	'/imgs/card-texture-9.png',
	'/imgs/card-texture-10.png',
	'/imgs/card-texture-11.png',
]

export const getBackgroundTextureById = (id: string) => {
	let hash = 0
	for (let i = 0; i < id.length; i++) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0
	}
	return CARD_BACKGROUNDTEXTURES[hash % CARD_BACKGROUNDTEXTURES.length]
}

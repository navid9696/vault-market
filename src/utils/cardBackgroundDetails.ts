export const CARD_BACKGROUNDDETAILS = [
	'/imgs/card-details-1.png',
	'/imgs/card-details-2.png',
	'/imgs/card-details-3.png',
	'/imgs/card-details-4.png',
	'/imgs/card-details-5.png',
	'/imgs/card-details-6.png',
	'/imgs/card-details-7.png',
	'/imgs/card-details-8.png',
	'/imgs/card-details-9.png',
	'/imgs/card-details-10.png',
	'/imgs/card-details-11.png',
	'/imgs/card-details-12.png',
	'/imgs/card-details-13.png',
	'/imgs/card-details-14.png',
	'/imgs/card-details-15.png',
]

export const getBackgroundDetailsById = (id: string) => {
	let hash = 0
	for (let i = 0; i < id.length; i++) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0
	}
	return CARD_BACKGROUNDDETAILS[hash % CARD_BACKGROUNDDETAILS.length]
}

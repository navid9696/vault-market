import { createMedia } from '@artsy/fresnel'

export const media = createMedia({
	breakpoints: {
		sm: 650,
		md: 768,
		lg: 1024,
		xl: 1280,
	},
})

export const { MediaContextProvider, Media } = media

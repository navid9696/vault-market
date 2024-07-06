import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {},
			boxShadow: {
				'custom-inset': 'inset 0px 50px 200px 25px #09090b',
			},
		},
	},
	plugins: [require('tailwind-scrollbar-hide')],
}
export default config

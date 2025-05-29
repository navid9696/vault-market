import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: 'class',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {},
			boxShadow: {
				'custom-inset': 'inset 0px 150px 100px 25px #09090b',
				'inset-1': 'inset 0px 0px 0px 1px #303030',
				'inset-2': 'inset 0px 0px 0px 2px #303030',
				'inset-3': 'inset 0px 0px 0px 3px #303030',
				'inner-shadow': 'inset 0 0 10px var(--primary)',
			},
			colors: {
				bg: 'var(--bg)',
				surface: 'var(--surface)',
				text: 'var(--text)',
				primary: 'var(--primary)',
				secondary: 'var(--secondary)',
				tertiary: 'var(--tertiary)',
				border: 'var(--border)',
				focus: 'var(--focus)',
			},
		},
	},
	plugins: [require('tailwind-scrollbar-hide')],
}
export default config

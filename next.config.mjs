import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.app.goo.gl',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'static.wikia.nocookie.net',
				port: '',
				pathname: '/**',
			},
		],
	},
}

export default withBundleAnalyzer(nextConfig)

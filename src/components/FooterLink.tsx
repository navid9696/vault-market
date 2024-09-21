import Link from 'next/link'

interface FooterLinkProps {
	href: string
	children: React.ReactNode
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
	return (
		<Link className='p-1 hover:text-green-500 transition-colors' href={href}>
			{children}
		</Link>
	)
}

export default FooterLink

import Link from 'next/link'
import { PropsWithChildren } from 'react'

interface FooterLinkProps extends PropsWithChildren {
	href: string
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
	return (
		<Link className='p-1 hover:text-green-500 transition-colors' href={href}>
			{children}
		</Link>
	)
}

export default FooterLink

import Link from 'next/link'
import { PropsWithChildren } from 'react'

interface FooterLinkProps extends PropsWithChildren {
	href: string
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
	return (
		<Link target='_blank' rel='noopener noreferrer' className='p-1 hover:text-focus transition-colors' href={href}>
			{children}
		</Link>
	)
}

export default FooterLink

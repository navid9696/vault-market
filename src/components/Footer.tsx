import Divider from '@mui/material/Divider'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import FooterLink from './FooterLink'
import { Media, MediaContextProvider } from '~/context/breakpointsContext'
import { FaXTwitter } from 'react-icons/fa6'
import React from 'react'

const footerLinks = [
	{ href: '/', icon: <FaFacebookF /> },
	{ href: '/', icon: <FaInstagram /> },
	{ href: '/', icon: <FaTiktok /> },
	{ href: '/', icon: <FaYoutube /> },
	{ href: '/', icon: <FaXTwitter /> },
]

const Footer = () => {
	return (
		<MediaContextProvider>
			<footer className='min-h-28 border-black border-t-8 text-text bg-bg'>
				<div className='flex flex-col md:flex-row justify-center'>
					<div className='flex-1 md:w-1/2 py-2 px-8 text-center text-sm'>
						<h3 className='mb-4 text-lg uppercase'>About</h3>
						<p>
							Welcome to the Wasteland&apos;s top online emporium! At{' '}
							<span className='text-base font-semibold'>Vault&nbsp;Market</span>, we offer the best post-apocalyptic
							essentials. Whether you need rare Nuka-Cola, reliable weapons, or survival gear, we&apos;ve got you
							covered. Explore our curated inventory and gear up for your adventures across the Wasteland!
						</p>
					</div>

					<Media greaterThanOrEqual='md'>
						<Divider className='bg-surface' orientation='vertical' />
					</Media>
					<Media lessThan='md'>
						<Divider className='bg-surface' />
					</Media>
					<div className='flex-1 md:w-1/2 py-2 px-8 text-center'>
						<h3 className='mb-4 text-lg uppercase'>Contact</h3>
						<div className='flex flex-col items-center justify-evenly gap-1 text-sm'>
							<FooterLink href='https://maps.app.goo.gl/mo15r7hfoZTrSqXL7'>
								1234 Elm Street, Suite 567, Springfield, IL 62704, USA
							</FooterLink>
							<FooterLink href='tel:+16171234567'>+1 (617) 123-4567</FooterLink>
							<FooterLink href='mailto:contact@company.com'>contact@company.com</FooterLink>
						</div>
					</div>
				</div>

				<Divider className='bg-surface' />
				<div className='p-2 flex flex-col items-center'>
					<h3 className='mb-4 text-lg uppercase'>Follow</h3>
					<div className='flex'>
						{footerLinks.map((link, index) => (
							<React.Fragment key={index}>
								<FooterLink href={link.href}>{link.icon}</FooterLink>
								{index < footerLinks.length - 1 && (
									<Divider className='mx-1 bg-surface' orientation='vertical' flexItem />
								)}
							</React.Fragment>
						))}
					</div>
				</div>

				<div className='flex justify-center p-2 text-sm bg-surface text-text'>
					<small className='text-center'>
						&copy; {new Date().getFullYear()} Vault Market. All rights reserved. Designed for survivors, by survivors.
					</small>
				</div>
			</footer>
		</MediaContextProvider>
	)
}

export default Footer

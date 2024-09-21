import Divider from '@mui/material/Divider'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import FooterLink from './FooterLink'

const Footer = () => {
	return (
		<footer className='min-h-28 border-black border-t-8 text-green-600 bg-zinc-950'>
			<div className='flex flex-col md:flex-row justify-center'>
				<div className='flex-1 md:w-1/2'>
					<div className='py-2 px-8 flex flex-col text-center text-sm '>
						<h3 className='mb-4 text-lg uppercase'>About</h3>
						<p>
							Welcome to the Wasteland&apos;s top online emporium! At{' '}
							<span className='text-base font-semibold'>Vault&nbsp;Market</span>, we offer the best post-apocalyptic
							essentials. Whether you need rare Nuka-Cola, reliable weapons, or survival gear, we&apos;ve got you
							covered. Explore our curated inventory and gear up for your adventures across the Wasteland!
						</p>
					</div>
				</div>

				<Divider className='custom-divider' orientation='vertical' variant='middle' flexItem />

				<div className='flex-1 md:w-1/2'>
					<div className='h-full py-2 px-8 flex flex-col text-center'>
						<h3 className='mb-4 text-lg uppercase'>Contact</h3>
						<div className='h-full flex flex-col items-center justify-evenly gap-1 text-sm'>
							<FooterLink href={'https://maps.app.goo.gl/mo15r7hfoZTrSqXL7'}>
								1234 Elm Street, Suite 567, Springfield, IL 62704, USA
							</FooterLink>
							<FooterLink href='tel:+16171234567'>+1 (617) 123-4567</FooterLink>
							<FooterLink href='mailto:contact@company.com'>contact@company.com</FooterLink>
						</div>
					</div>
				</div>
			</div>
			<Divider className='bg-green-950' variant='middle' />
			<div className='p-2 flex flex-col justify-center items-center'>
				<h3 className='mb-4 text-lg uppercase'>follow</h3>
				<div className='flex '>
					<FooterLink href={'/'}>
						<FaFacebookF />
					</FooterLink>
					<Divider className='mx-1 bg-green-950' orientation='vertical' flexItem />
					<FooterLink href={'/'}>
						<FaInstagram />
					</FooterLink>
					<Divider className='mx-1 bg-green-950' orientation='vertical' flexItem />
					<FooterLink href={'/'}>
						<FaYoutube />
					</FooterLink>
					<Divider className='mx-1 bg-green-950' orientation='vertical' flexItem />
					<FooterLink href={'/'}>
						<FaXTwitter />
					</FooterLink>
					<Divider className='mx-1 bg-green-950' orientation='vertical' flexItem />
					<FooterLink href={'/'}>
						<FaTiktok />
					</FooterLink>
				</div>
			</div>
			<div className='flex justify-center p-2 text-sm bg-green-900 text-green-400'>
				<small className='text-center'>
					&copy; {new Date().getFullYear()} Vault Market. All rights reserved. Designed for survivors, by survivors.
				</small>
			</div>
		</footer>
	)
}

export default Footer

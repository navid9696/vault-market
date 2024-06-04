import Image from 'next/image'
import ShoppingCart from '@mui/icons-material/ShoppingCartTwoTone'
import Link from 'next/link'
import AccountMenu from './AccountMenu'
import { Badge } from '@mui/material'

const Navbar = () => {
	return (
		<>
			<div className='sticky top-0 mx-auto'>
				<nav className='p-2 flex items-center justify-between mx-auto max-w-screen-md  h-12 bg-green-700 md:rounded-full z-10'>
					<div className='flex items-center '>
						<div>
							<Link href={'/'}>
								<Image src={'/imgs/logo.png'} width={50} height={50} alt='logo with vault boy' />
							</Link>
						</div>
						<div className='ml-7 flex flex-col items-center'>
							<Image src={'/imgs/nuka-cap.png'} width={25} height={25} alt='nuka cola bottle cap' />
							<span className='text-sm'>1500</span>
						</div>
					</div>
					<div className='flex items-center'>
						<Link className='mr-3' href={'/cart'}>
							<Badge badgeContent={5} color='warning'>
								<ShoppingCart />
							</Badge>
						</Link>

						<AccountMenu />
					</div>
				</nav>
				<div className='absolute hidden lg:block inset-0 bg-green-700 w-[900px] h-2 top-1 mx-auto rounded-full -z-10'></div>
				<div className='absolute hidden lg:block inset-0 bg-green-700 w-[1000px] h-2 top-5 mx-auto rounded-full -z-10'></div>
				<div className='absolute hidden lg:block inset-0 bg-green-700 w-[900px] h-2 top-9 mx-auto rounded-full -z-10'></div>
			</div>
		</>
	)
}

export default Navbar
